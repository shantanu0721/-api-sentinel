import httpx
import time

def check_api(url: str):
    try:
        start = time.time()

        response = httpx.get(url, timeout=5)

        end = time.time()

        response_time = (end - start) * 1000

        return {
            "status_code": response.status_code,
            "response_time": response_time,
            "success": response.status_code >= 200 and response.status_code < 500
        }

    except Exception as e:
        return {
            "status_code": None,
            "response_time": None,
            "success": False,
            "error": str(e)
        }