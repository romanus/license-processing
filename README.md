# License Processing

## Usage:

#### Insert license to all files in Assets/Scripts folder except meta files:
`node license -insert -src ./license.txt -path ./Assets/Scripts -exclude ".*\.meta"`

#### Delete license from all files in Assets/Scripts folder except meta files:
`node license -delete -path ./Assets/Scripts`

#### Replace current license with new:
`node license -replace -src ./license.txt -path ./Assets/Scripts -exclude ".*\.meta"`
