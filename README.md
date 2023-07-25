### How to run 
```
1. install dependencies
npm install

2. run server locally
npm run dev

3. jest & supertest for api testing
npm run test
```

### API Endpoint & Response

1. upload file
```

// filePath = 'localpathtoyourfile/IM000002'
curl --location --request POST 'localhost:3000/api/upload' \
--form 'file=@{filePath}'


{
    "fileId": "f39acf6ae1c3e2f2403dcb67ad58c4b6"
}
```

2. get dicom file information based on query tag

```
// fileId = f39acf6ae1c3e2f2403dcb67ad58c4b6
// dicomTag = 00100010 
// dicomTag is a string 8 digits, https://www.dicomlibrary.com/dicom/dicom-tags/
// 00100010 Patient's Name
// 00100020	Patient ID
// 00200013	Instance Number

curl --location --request GET 'localhost:3000/api/dicom?fileId={fileId}&dicomTag={dicomTag}'

{
    "dicomTag": "00100010",
    "value": "NAYYAR^HARSH"
}
```


3. return a png image for dicom for upload dicom file, query by fileid

```
// fileId = f39acf6ae1c3e2f2403dcb67ad58c4b6
curl --location --request GET 'localhost:3000/api/dicom/image?fileId={fileId}'

{
    "imagePath": "rootpathproject/assets/f39acf6ae1c3e2f2403dcb67ad58c4b6.png"
}
```