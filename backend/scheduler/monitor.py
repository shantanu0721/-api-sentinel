from apscheduler.schedulers.background import BackgroundScheduler
from database.db import SessionLocal
from sqlalchemy import text
from services.api_checker import check_api


def monitor_apis():
    db = SessionLocal()

    try:
        apis = db.execute(
            text("SELECT * FROM monitored_apis")
        ).fetchall()

        for api in apis:

            result = check_api(api.url)
            

            db.execute(
                text("""
                    INSERT INTO api_logs 
                    (api_id, status_code, response_time_ms, success)

                    VALUES 
                    (:api_id, :status_code, :response_time, :success)
                """),
                {
                    "api_id": api.id,
                    "status_code": result["status_code"],
                    "response_time": result["response_time"],
                    "success": result["success"]
                }

                
            )
            previous_log = db.execute(
                text("""
                    SELECT success
                    FROM api_logs
                    WHERE api_id = :api_id
                    ORDER BY checked_at DESC
                    LIMIT 1 OFFSET 1
                """),
                {
                    "api_id": api.id
                }
            ).fetchone()
            if (
                (
                    previous_log
                    and previous_log.success == True
                )
                or previous_log is None
            ) and result["success"] == False:

                db.execute(
                    text("""
                        INSERT INTO alerts (api_id, message)
                        VALUES (:api_id, :message)
                    """),
                    {
                        "api_id": api.id,
                        "message": f"{api.name} is down"
                    }
                )
        
            
            

        db.commit()

        print("APIs checked successfully")

    except Exception as e:
        print("Error:", e)

    finally:
        db.close()


scheduler = BackgroundScheduler()

scheduler.add_job(
    monitor_apis,
    'interval',
    seconds=10
)

scheduler.start()