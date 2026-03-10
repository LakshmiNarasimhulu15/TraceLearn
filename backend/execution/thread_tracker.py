import threading

def get_thread_info():
    threads = []
    for t in threading.enumerate():
        threads.append({
            "name": t.name,
            "alive": t.is_alive(),
            "daemon": t.daemon
        })
    return threads