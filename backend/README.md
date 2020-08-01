## Backend Setup

## Install MongoDB
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
Add mongo.exe to PATH

## Install virtualenv package on the terminal
```bash
py -m pip install --user virtualenv
```

## Enable scripts (Run only if scripts are disabled)
https://www.faqforge.com/windows/windows-powershell-running-scripts-is-disabled-on-this-system/
Run this command on Windows Powershell
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## Change MongoDB connection String from local to cloud and vice-versa
Navigate to backend/utils/connect.py

### For Cloud
```bash
CONNECTION_STRING = os.getenv("MONGODB_STRING_CLOUD")
```

### For Local
```bash
CONNECTION_STRING = os.getenv("MONGODB_STRING")
```

## Create a virtual environment
```bash
cd backend
py -m venv env
```

## Activate environment
```bash
.\env\Scripts\activate
```

## Install packages
```bash
pip install -r requirements.txt
```

## Export dependencies
```bash
pip freeze > requirements.txt
```
Copy paste the output to requirements.txt

## Deactivate Environment
```bash
deactivate
```

## Uncomment
```bash
process.py line 13 and 14
```