1. pip install -r requirements.txt
2. python test.py

All api method : POST
http://127.0.0.1:5000/contractadvisor/title

http://127.0.0.1:5000/contractadvisor/suspicious

http://127.0.0.1:5000/contractadvisor/conditions

http://127.0.0.1:5000/contractadvisor/startdate

Headers : 
Content-Type: application/x-www-form-urlencoded

Body : x-www-form-urlencoded
file: Paste text of contract

CF not working : contractadvisor-translucid-juror.cfapps.sap.hana.ondemand.com/contractadvisor/title
502 Bad Gateway: Registered endpoint failed to handle the request.

--

The UI is available at http://127.0.0.1:5000

on Upload of a docx file, the file will be uploaded in the folder 'uploads' with filename 'input'
the text version of the file will be available in the folder 'uploads' with filename 'output'
