/* eslint-disable @typescript-eslint/restrict-template-expressions */
const fs = require('fs')
const path = require('path')
const solution = require('./solution')

const INPUT_PATH = path.resolve(__dirname, './input.json')
const OUTPUT_PATH = path.resolve(__dirname, './index.html')

const json = JSON.parse(fs.readFileSync(INPUT_PATH, { encoding: 'utf-8' })) as {}

const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
        <meta charset="UTF-8" />
        <title>FIGMA to HTML</title>
    </head>
    <body style="padding: 0; margin: 0;">
        ${solution(json)}
    </body>
    </html>
`

fs.writeFileSync(OUTPUT_PATH, html, { encoding: 'utf-8' })
