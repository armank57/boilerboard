#!/bin/bash

# Find and delete all __pycache__ directories
find . -type d -name "__pycache__" -exec rm -r {} +

# Find and delete all migration files except for __init__.py
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete

