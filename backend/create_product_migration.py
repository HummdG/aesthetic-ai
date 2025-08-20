"""
Script to create Alembic migration for Product and LiveSnapshot models
"""
import subprocess
import sys
import os

def create_migration():
    """Create Alembic migration for product models"""
    try:
        # Change to backend directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Generate migration
        result = subprocess.run([
            sys.executable, "-m", "alembic", "revision", "--autogenerate", 
            "-m", "Add Product and LiveSnapshot models"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Migration created successfully!")
            print(f"Output: {result.stdout}")
        else:
            print("❌ Migration creation failed!")
            print(f"Error: {result.stderr}")
            
    except Exception as e:
        print(f"❌ Error creating migration: {e}")

if __name__ == "__main__":
    create_migration() 