from fastapi import FastAPI , Request
from database.db import SessionLocal
from sqlalchemy import text
from scheduler.monitor import scheduler
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "API Sentinel running"}


@app.get("/apis")
@app.get("/apis")
def get_apis():

    db = SessionLocal()

    try:

        result = db.execute(
            text("""
                SELECT
                    monitored_apis.*,
                    latest_logs.status_code,
                    latest_logs.response_time_ms,
                    latest_logs.success,
                    latest_logs.checked_at

                FROM monitored_apis

                LEFT JOIN (
                    SELECT DISTINCT ON (api_id)
                        api_id,
                        status_code,
                        response_time_ms,
                        success,
                        checked_at

                    FROM api_logs

                    ORDER BY api_id, checked_at DESC
                ) AS latest_logs

                ON monitored_apis.id = latest_logs.api_id
            """)
        )

        apis = result.fetchall()

        return {
            "data": [dict(api._mapping) for api in apis]
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        db.close()

@app.get("/test-db")
def test_db():
    db = SessionLocal()
    try:
        result = db.execute(text("SELECT * FROM monitored_apis"))
        data = result.fetchall()
        return {"data": [dict(row._mapping) for row in data]}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()

@app.post("/apis")
async def add_api(request: Request):

    data = await request.json()

    db = SessionLocal()

    try:
        

        db.execute(
            text("""
                INSERT INTO monitored_apis
                (user_id, name, url, method, interval_seconds, timeout_seconds)

                VALUES
                (:user_id, :name, :url, :method, :interval, :timeout)
            """),
            {
                "user_id": data["user_id"],
                "name": data["name"],
                "url": data["url"],
                "method": data["method"],
                "interval": data["interval_seconds"],
                "timeout": data["timeout_seconds"]
            }
        )

        db.commit()

        return {"message": "API added successfully"}

    except Exception as e:
        return {"error": str(e)}

    finally:
        db.close()

@app.get("/alerts")
def get_alerts():

    db = SessionLocal()

    try:

        result = db.execute(
            text("""
                SELECT
    alerts.*,
    monitored_apis.name
FROM alerts

JOIN monitored_apis
ON alerts.api_id = monitored_apis.id

ORDER BY created_at DESC
LIMIT 10
            """)
        )

        alerts = result.fetchall()

        return {
            "data": [dict(alert._mapping) for alert in alerts]
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        db.close()

@app.delete("/apis/{api_id}")
def delete_api(api_id: int):

    db = SessionLocal()

    try:

        db.execute(
            text("DELETE FROM api_logs WHERE api_id = :api_id"),
            {"api_id": api_id}
        )

        db.execute(
            text("DELETE FROM alerts WHERE api_id = :api_id"),
            {"api_id": api_id}
        )

        db.execute(
            text("DELETE FROM monitored_apis WHERE id = :api_id"),
            {"api_id": api_id}
        )

        db.commit()

        return {"message": "API deleted successfully"}

    except Exception as e:
        return {"error": str(e)}

    finally:
        db.close()


@app.post("/register")
async def register_user(request: Request):

    data = await request.json()

    db = SessionLocal()

    try:

        result=db.execute(
            text("""
                INSERT INTO users (name, email)
                VALUES (:name, :email)
                RETURNING id, name, email
            """),
            {
                "name": data["name"],
                "email": data["email"]
            }
        )
        user = result.fetchone()

        db.commit()

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }

    except Exception as e:

        return {
            "error": str(e)
        }

    finally:
        db.close()



# api testing-------
from services.api_checker import check_api
@app.get("/check")
def check():
    db = SessionLocal()


    try:
        api_id = 1  # temporary (we already inserted 1 API manually)

        result = check_api("https://jsonplaceholder.typicode.com/posts")

        db.execute(
            text("""
                INSERT INTO api_logs (api_id, status_code, response_time_ms, success)
                VALUES (:api_id, :status_code, :response_time, :success)
            """),
            {
                "api_id": api_id,
                "status_code": result["status_code"],
                "response_time": result["response_time"],
                "success": result["success"]
            }
        )

        db.commit()

        return result

    except Exception as e:
        return {"error": str(e)}

    finally:
        db.close()
