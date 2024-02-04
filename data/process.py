from collections import defaultdict
import csv
import json


output = defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: defaultdict(int))))

def get_percent(a, b):
    if not int(b):
        return 0
    
    return round(int(a) / int(b) * 100, 1)


with open('countypres_2000-2020.csv', mode='r') as infile:
    reader = csv.DictReader(infile)

    for row in reader:
        if row["party"] not in ['REPUBLICAN', 'DEMOCRAT']:
            continue
        if row["county_fips"] == "NA":
            continue
        if row["totalvotes"] == "0":
            continue

        item = output[int(row["year"])][int(row["county_fips"])][row["party"]]

        item['votes'] += int(row["candidatevotes"])
        item['total_votes'] = int(row["totalvotes"])
        item['candidate'] = row["candidate"]
        item['percent'] = get_percent(item["votes"], item["total_votes"])


    with open('election_results.json', mode='w') as outfile:
        json.dump(output, outfile, ensure_ascii=False, indent=2)
