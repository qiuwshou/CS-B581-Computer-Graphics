from scrapy.spider import BaseSpider
from scrapy.selector import Selector
class DmozSpider(BaseSpider):
    name = "dmoz"
    allowed_domains = ["sports-reference.com"]
    start_urls = [
        "http://www.sports-reference.com/cbb/boxscores/2015-11-15-north-carolina.html"
        
    ]

    def parse(self, response):
        hxs = Selector(response)
        team1 = hxs.xpath('//*[@id="boxes"]/div[2]/@id').extract()
        team2 = hxs.xpath('//*[@id="boxes"]/div[6]/@id').extract()
        data1 = hxs.xpath('//*[@id="boxes"]/div[2]/table/tbody//tr//td').extract()
        data2 = hxs.xpath('//*[@id="boxes"]/div[6]/table/tbody//tr//td').extract()        
        filename = response.url.split("/")[-1]
        open(filename, 'wb').write(str(team1)+str(data1) + '\n' + str(team2)+ str(data2))

        
