import feedparser
from .models import Headline


def fetch_headlines(request, feed_source, title='title', URL='link'):
    feed = feedparser.parse(feed_source)
    for item in feed['feed']:
        new_headline = Headline(text=item[title], source=item[URL])
        new_headline.save()

