import json

d = json.load(open('content/site.json'))
r = d['reunion']

# 6. Doors Open copy
r['schedule'][0]['detail'] = 'Welcome, name tags, and getting settled.'

# 7. Travel by air: SBN first, FWA second, four others
r['airports']['secondary'] = {
    'code': 'Fort Wayne International Airport (FWA)',
    'detail': 'The second-best airport option after South Bend International Airport.'
}
r['airports']['others'] = [
    'Kalamazoo/Battle Creek International Airport (AZO)',
    'Gerald R. Ford International Airport in Grand Rapids (GRR)',
    'Chicago Midway International Airport (MDW)',
    'Chicago O\u2019Hare International Airport (ORD)'
]
r['airports']['tip'] = 'Check flight prices and schedules for SBN first, followed by FWA. It may also be worth comparing the other airports for better fares or nonstop flights.'

# 4. Local restaurant recommendations (replace legacy grouped data)
r['restaurants'] = {
    'local': [
        {
            'name': 'Biebs & Ash',
            'description': 'Great smashburgers and loaded fries in downtown Goshen.',
            'url': 'https://www.biebsandash.com/',
            'hours': ['Tuesday: 4\u20139pm', 'Wednesday: 4\u20139pm', 'Thursday: 11am\u20132pm, 4\u20139pm',
                      'Friday: 11am\u20132pm, 4\u20139pm', 'Saturday: 11am\u20132pm, 4\u20139pm',
                      'Sunday\u2013Monday: Closed']
        },
        {
            'name': 'Olympia Candy Kitchen',
            'description': 'A historic Goshen diner and soda fountain with handmade chocolates and candy.',
            'url': 'https://olympiacandykitchen.com/',
            'hours': ['Monday: 7am\u20132pm', 'Tuesday: 7am\u20132pm', 'Wednesday: Closed',
                      'Thursday: 7am\u20132pm', 'Friday: 7am\u20132pm', 'Saturday: 7am\u20132pm',
                      'Sunday: Closed']
        },
        {
            'name': 'The Fold',
            'description': 'New York-style pizza by the slice or whole pizza. Dining room and patio are 21+; carryout is available for all ages.',
            'url': 'https://thefoldgoshen.com/',
            'hours': ['Sunday: 4\u201310pm', 'Monday: 4\u201311pm', 'Tuesday: Closed',
                      'Wednesday: 4\u201311pm', 'Thursday: 4\u201311pm',
                      'Friday: 11:30am\u20131:30pm, 4pm\u201312am', 'Saturday: 12pm\u201312am']
        },
        {
            'name': 'Goshen Brewing Company',
            'description': 'Family-friendly local brewpub with house-made beer and scratch-made food.',
            'url': 'https://goshenbrewing.com/',
            'hours': ['Sunday: 10am\u20138pm', 'Brunch + kids\u2019 menu: 10am\u20132pm', 'Kitchen: 3\u20137pm',
                      'Monday: Closed', 'Tuesday\u2013Thursday: 3\u201310pm', 'Kitchen: 4\u20139pm',
                      'Tuesday food is Pad Thai + kids\u2019 menu only', 'Friday: 3\u201310pm',
                      'Kitchen: 4\u20139pm', 'Saturday: 12\u201310pm', 'Kitchen until 9pm']
        },
        {
            'name': 'Cortado',
            'description': 'Downtown caf\u00e9 with coffee, breakfast and lunch, including gluten-free and vegan options.',
            'url': 'https://www.cortadogoshen.com/',
            'hours': ['Monday\u2013Friday: 7am\u20135pm', 'Saturday: 8am\u20132pm', 'Sunday: Closed']
        },
        {
            'name': 'El Rancho Viejo',
            'description': 'Mexican restaurant near Menards.',
            'url': None,
            'hours': ['Sunday\u2013Thursday: 11am\u20139pm', 'Friday\u2013Saturday: 11am\u201310pm']
        },
        {
            'name': 'The Table @108',
            'description': 'Italian-inspired food with locally sourced ingredients in downtown Goshen.',
            'url': 'https://thetable108.com/',
            'hours': ['Tuesday\u2013Saturday: 4:30\u20139pm', 'Sunday\u2013Monday: Closed']
        },
        {
            'name': 'Das Dutchman Essenhaus',
            'description': 'A short drive to Middlebury for Amish-country cooking, homemade baked goods and a classic northern Indiana experience.',
            'url': 'https://dhgroup.com/',
            'hours': ['Restaurant:',
                      'Tuesday\u2013Thursday: 7am\u20137pm', 'Friday\u2013Saturday: 7am\u20138pm',
                      'Sunday\u2013Monday: Closed',
                      'Bakery:',
                      'Tuesday\u2013Thursday: 6:30am\u20137pm', 'Friday\u2013Saturday: 6:30am\u20138pm',
                      'Sunday\u2013Monday: Closed']
        }
    ],
    'note': 'Hours are current as of September 2026 and may change before the reunion. Please check the restaurant\u2019s website or call before visiting.'
}

json.dump(d, open('content/site.json', 'w'), indent=2, ensure_ascii=False)
print('site.json updated')
