from scrapy.spider import BaseSpider
from scrapy.selector import Selector
class LinkSpider(BaseSpider):
    name = "link"
    allowed_domains = ["sports-reference.com"]
    start_urls = [
        "http://www.sports-reference.com/cbb/boxscores/index.cgi?month=11&day=15&year=2015",
        "http://www.sports-reference.com/cbb/boxscores/index.cgi?month=12&day=5&year=2015"
    ]

    def parse(self, response):
        hxs = Selector(response)
        #links = hxs.xpath('//*[@id="scoreboard_div"]/table/tbody//tr//td/table/tbody/tr[1]/td/table/tbody/tr[1]/td[3]/a').extract()
        links = hxs.xpath('//*[@id="scoreboard_div"]/table//a/@href').extract()
        filename = response.url.split("?")[-1] + '.html'
        open(filename, 'wb').write(str(links))

                 

        
