---
path: "/json-resume"
date: "2020-12-3"
title: "Store your resume as a JSON file"
summary: "Store your resume in a JSON doc and then apply various styles to it"
image: ""
author: "Giwan Persaud"
published: true
---

Whenever it's time to update your resume, it's always a bit of a hassle. It's always a combination of styling and data. Why not separte the data from the style.
This _could_ allow for different styling to be applied based on your own preferences.

---

After a quick search I found that the idea has already been worked out by [jsonresume](https://jsonresume.org/).

# Benefits

-   Store your resume data in a simple format without formatting
-   Apply various templates to that data for styling

# Gist resume.json

Go to https://gist.github.com and press the `+` button in the top right to create a new gist. Make sure to name it a `resume.json`.

> Make a public gist named `resume.json`

We'll start with the following schema but you can find more here https://jsonresume.org/schema/.

```json
{
    "basics": {
        "name": "Giwan Persaud",
        "label": "Programmer",
        "picture": "",
        "email": "john@gmail.com",
        "phone": "0600000000",
        "website": "https://mytoori.com",
        "summary": "A summary about me",
        "location": {
            "address": "2712 Broadway St",
            "postalCode": "CA 94115",
            "city": "San Francisco",
            "countryCode": "US",
            "region": "California"
        }
    },
    "work": [
        {
            "company": "Company",
            "position": "President",
            "website": "http://company.com",
            "startDate": "2013-01-01",
            "endDate": "2014-01-01",
            "summary": "Description..."
        }
    ],
    "education": [
        {
            "institution": "University",
            "area": "Software Development",
            "studyType": "Bachelor",
            "startDate": "2011-01-01",
            "endDate": "2013-01-01"
        }
    ],
    "skills": [
        {
            "name": "Web Development",
            "level": "Senior",
            "keywords": ["HTML", "CSS", "Javascript"]
        }
    ],
    "languages": [
        {
            "language": "English",
            "fluency": "Native speaker"
        }
    ]
}
```

Once the gist has been created and published, you are able to see your CV using the default theme at:

`https://registry.jsonresume.org/{github_username}`

Example
https://registry.jsonresume.org/giwan

There is more information on the website from jsonresume site. However this was a quick intro into how this works.

# Room for improvement

There are a few things about this approach that I don't like. The user is required to publish their JSON resume publicly. If everyone were to do that, mining that data would become increasingly easy.

Yes your resume online is also mineable. However, I'm not sure that the benefits that resumejson offers enough benefits for this tradeoff.
Still the idea has merrits.

---

Source: https://jsonresume.org/
