const fs = require('fs')

const parseConcerts = () => {
    const srcPath = './data/concerts/data.json';
    const target = './site/content/fi/keikat'

    if (fs.existsSync(target)) {
        fs.rmSync(target, {
            recursive: true,
            force: true
        })
    }
    fs.mkdirSync(target)

    const currentDate = new Date()
    const concerts = JSON.parse(fs.readFileSync(srcPath))
        .reduce((result, item) => {
            const dateParts = item.date.split(".")
            const date = new Date(
                parseInt(dateParts[2], 10),
                parseInt(dateParts[1], 10) - 1,
                parseInt(dateParts[0], 10) + 1
            )
            const itemWithDate = { ...item, timestamp: date }
            if (date > currentDate) {
                return ({ ...result, future: [...result.future, itemWithDate] })
            }
            return ({ ...result, past: [...result.past, itemWithDate] })
        }, { future: [], past: [] })

    const past = concerts.past.reduce((result, item) => {
        const year = item.timestamp.getFullYear()
        return { ...result, [year]: [...(result[year] || []), item] }
    }, {})

    const placeHolder = "Ei tulevia keikkoja. Varaa oma yksityiskeikkasi sähköpostilla: keikat@kaupunginnaiset.fi"

    const pastText = Object.keys(past).reverse().map(year => {
        const concerts = past[year]
        return `${year != currentDate.getFullYear() ? `### ${year}  ` : ""}

${concerts.map((item, index) => {
            return `${item.date}  
${item.url ? `[${item.name}](${item.url})` : item.name}  
${item.location}  
${index < concerts.length - 1 ? "  " : ""}
`
        }).join(" ")}
 `
    }).join(" ")


    const content = `
---
title: "Keikat"
omit_header_text: true
---

## Tulevat
${concerts.future.length > 0 ? "" : placeHolder}

## Menneet

${pastText}

`
    fs.writeFileSync(`${target}/_index.md`, content)
}

module.exports = parseConcerts