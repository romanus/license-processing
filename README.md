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

#### Insert license to all .cs, .java and .mm files except for GoogleVR and Vuforia folders content
` node license.js -insert -src ./license.txt -path ./ -matches ".*\.(cs|mm|java)$" -exclude "(GoogleVR|Vuforia)\/"`

#### Delete license from all files in Assets folder
`node license.js -delete -path ./Assets`

#### Replace current license with new
`node license.js -replace -src ./license.txt -path ./ -matches ".*\.(cs|mm|java)$" -exclude "(GoogleVR|Vuforia)\/"`
