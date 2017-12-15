# License Processing

### Prerequisites
Node v8.0.0 or higher needed (check `node -v`).

It assumes that all licenses have pattern 
```
/* license text 
 * in multiple rows 
 */
```

### Usage

#### Insert license to all .cs files in Assets folder except for GoogleVR folder content
`node license.js -insert -src ./license.txt -path ./Assets -matches ".*\.cs$" -exclude "GoogleVR/"`

#### Delete license from all files in Assets folder
`node license.js -delete -path ./Assets`

#### Replace current license with new
`node license.js -replace -src ./license.txt -path ./Assets -matches ".*\.cs$" -exclude "GoogleVR/"`
