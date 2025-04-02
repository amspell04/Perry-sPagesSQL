#!/bin/bash

# Start the Uvicorn server in the background
uvicorn main:app --reload &

sleep 2  # Give the server some time to start
open http://127.0.0.1:5500  #