# License Processing

### Prerequisites
It assumes that all licenses have pattern 
```
/* license text 
 * in multiple rows 
 */
```


### Usage

#### Insert license to all files in Assets/Scripts folder except meta files:
`node license.js -insert -src ./license.txt -path ./Assets/Scripts -exclude ".*\.meta"`

#### Delete license from all files in Assets/Scripts folder except meta files:
`node license.js -delete -path ./Assets/Scripts`

#### Replace current license with new:
`node license.js -replace -src ./license.txt -path ./Assets/Scripts -exclude ".*\.meta"`
