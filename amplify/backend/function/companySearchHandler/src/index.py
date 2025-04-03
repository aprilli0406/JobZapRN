import json
import urllib.request

def handler(event, context):
    # Get the search query from URL parameter (?search=...)
    query = event.get('queryStringParameters', {}).get('search', '')

    if not query:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            'body': json.dumps({"error": "Missing search query"})
        }
    # Clearbit API URL
    url = f"https://autocomplete.clearbit.com/v1/companies/suggest?query={query}"

    try:
        with urllib.request.urlopen(url) as response: # Make request to Clearbit API
            data = json.loads(response.read())

            results = [{
                "name": company["name"],
                "domain": company["domain"],
                "logo": company["logo"]
            } for company in data]

    except Exception as e:
        print("Error while fetching from Clearbit:", str(e))
        results = []

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        },
        'body': json.dumps(results)
    }
