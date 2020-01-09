import csv
from json import loads, dumps
from os import listdir

for fil in listdir('.\\'):
    print(fil)
    with open(fil, 'r') as csvfile:
        csvobj = csv.DictReader(csvfile)
        csvobj = [row for row in csvobj]
        filename = fil.split('.')[0]
        with open(filename + ".json", 'w+') as jsonfile:
            jsonfile.write(dumps(csvobj, sort_keys=True, indent=4))
