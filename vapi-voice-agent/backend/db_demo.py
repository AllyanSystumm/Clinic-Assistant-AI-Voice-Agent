import sys
import os
from sqlalchemy import text

# Add the parent directory (vapi-voice-agent root) to the system path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import engine


def run_sql(query: str):
	"""Run a raw SQL query on the same DB used by `database.py`.

	Example:
		rows = run_sql("SELECT * FROM appointments")
		print(rows)
	"""
	#init_db()  # ensures the appointments table exists
	with engine.begin() as conn:
		result = conn.execute(text(query))
		return result.fetchall() if result.returns_rows else result.rowcount

query = """SELECT * FROM appointments"""
print(run_sql(query))