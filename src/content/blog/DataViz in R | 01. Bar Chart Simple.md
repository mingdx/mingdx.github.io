---

author: Mindx
pubDatetime: 2023-04-15T11:15:00+07:00
title: "DataViz in R | 01. Bar Chart Simple"
postSlug: ""
featured: false
draft: false
tags:

- dataviz
- learning
ogImage: ""
description: "Khởi đầu series thử tái tạo lại các biểu đồ trong cuốn sách Data Visualisation with R sử dụng package ggplot2"

---

Sau khi học xong khóa [**Learn ggplot2 in R for Data Visualization**](https://www.udemy.com/course/learn-ggplot2-in-r-for-data-viz/) của Clara Granell trên Udemy và hiểu một số câu lệnh cơ bản của package `ggplot2`, tôi thấy rất thích thú với các bài tập yêu cầu vẽ lại các biểu đồ cho trước. Nó yêu cầu bạn phải vận dụng nhiều kĩ năng phân tích cũng như (tất nhiên) search Google, Stackoverflow để cho ra kết quả cuối cùng sát nhất có thể.

Trong quá trình tìm kiếm tôi tìm thấy cuốn sách ["Data Visualisation with R - 111 Examples"](http://www.datavisualisation-r.com/) của Thomas Rahlf, có rất nhiều ví dụ đẹp nhưng lại vẽ bằng R-base. Nhìn qua code không gọn gàng nên tôi quyết định sẽ vẽ lại bằng package ggplot, như là một cơ hội để luyện tập và lên content cho blog này.

Quá trình học sử dụng `jupyter notebook`, sau khi xong xuôi sẽ export ra file markdown và đưa lên blog. Ngôn ngữ sử dụng lẫn cả tiếng Anh lẫn tiếng Việt để thuận tiện.

Giờ thì đến với biểu đồ đầu tiên: **Bar Chart Simple**

TL;DR:
## What I have learned?

1. Load data from excel file using lib `readxl`
2. Shorten the way we call `fct_reorder` using operator `%>%`
3. How to highlight bar by using mapping **aes** fill, **ifelse** condition and scale_fill_manual
4. Draw zebra-like background using `geom_rect`
5. Increase the distance between label on y-axis and axis-line: `axis.text` margin
6. Add columns to dataframe to avoid out of variable syncing in different geom layers
7. Display out-of-plot geom_text by `plot.margin` & `clip=off` in coord
8. Changing font with `extrafont`. But I think we should left the majority of this work for image editor tools
9. Adding annotate to the plot and avoid using geom_text
10. How to use ggsave(): remove quotation mark in `device` does the magic (if not, font will be inappropriately rendered), specify w x h with unit of measure


    

## Target result

![image.png](attachment:image.png)

http://www.datavisualisation-r.com/pdf/barcharts_simple.pdf

The ﬁgure shows the results of a 2010 survey carried out in different countries:
How many percent of the respondents agreed with the statement **“I Deﬁnitely
Believe in God or a Supreme Being”?**


Data are derived from an Ipsos survey that was ordered by the
Thompson Reuters News Service and performed between 7 and 23 September 2010
in 24 countries. The study used an international sample
of adults aged between 18 and 64 years from the USA and Canada, and aged
between 16 and 64 years from all other countries. The unweighted basis of the
respondents numbered **18,531 people**. The survey included approximately 1000
people from each country, excluding Argentina, Indonesia, Mexico, Poland, Saudi
Arabia, South Africa, South Korea, Sweden, Russia, and Turkey, where the sample
size was approximately 500.

Load các library cần thiết
```r
library(ggplot2)
library(viridis)
library(dplyr)
theme_set(theme_minimal()) 

```r
#Import data from excel file with lib readxl
library(readxl)
ipsos <- read_excel("./myData/ipsos.xlsx")
ipsos
```


<table class="dataframe">
<caption>A tibble: 16 × 2</caption>
<thead>
	<tr><th scope=col>Country</th><th scope=col>Percent</th></tr>
	<tr><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;dbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td>Indonesia    </td><td>93</td></tr>
	<tr><td>Turkey       </td><td>91</td></tr>
	<tr><td>Brazil       </td><td>84</td></tr>
	<tr><td>South Africa </td><td>83</td></tr>
	<tr><td>USA          </td><td>70</td></tr>
	<tr><td>India        </td><td>56</td></tr>
	<tr><td>Russia       </td><td>56</td></tr>
	<tr><td>Poland       </td><td>51</td></tr>
	<tr><td>Italy        </td><td>50</td></tr>
	<tr><td>Canada       </td><td>46</td></tr>
	<tr><td>Hungary      </td><td>29</td></tr>
	<tr><td>Germany      </td><td>27</td></tr>
	<tr><td>Great Britain</td><td>25</td></tr>
	<tr><td>France       </td><td>19</td></tr>
	<tr><td>South Korea  </td><td>18</td></tr>
	<tr><td>China        </td><td> 9</td></tr>
</tbody>
</table>




```r
#Add thêm label thẳng vào dataframe để tránh việc gọi dataset nhiều lần
#Do ở dưới lúc đầu mapping y vào Country, sau lại để là Coulab nên fct_reorder 2 lần
library(forcats)

ipsos <- ipsos %>% 
    mutate(Coulab=paste0(Country, " ", Percent)) %>%
    mutate(Coulab=fct_reorder(Coulab, Percent)) %>%
    mutate(Country=fct_reorder(Country, Percent))
ipsos
```
<table class="dataframe">
<caption>A tibble: 16 × 3</caption>
<thead>
	<tr><th scope=col>Country</th><th scope=col>Percent</th><th scope=col>Coulab</th></tr>
	<tr><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;fct&gt;</th></tr>
</thead>
<tbody>
	<tr><td>Indonesia    </td><td>93</td><td>Indonesia 93    </td></tr>
	<tr><td>Turkey       </td><td>91</td><td>Turkey 91       </td></tr>
	<tr><td>Brazil       </td><td>84</td><td>Brazil 84       </td></tr>
	<tr><td>South Africa </td><td>83</td><td>South Africa 83 </td></tr>
	<tr><td>USA          </td><td>70</td><td>USA 70          </td></tr>
	<tr><td>India        </td><td>56</td><td>India 56        </td></tr>
	<tr><td>Russia       </td><td>56</td><td>Russia 56       </td></tr>
	<tr><td>Poland       </td><td>51</td><td>Poland 51       </td></tr>
	<tr><td>Italy        </td><td>50</td><td>Italy 50        </td></tr>
	<tr><td>Canada       </td><td>46</td><td>Canada 46       </td></tr>
	<tr><td>Hungary      </td><td>29</td><td>Hungary 29      </td></tr>
	<tr><td>Germany      </td><td>27</td><td>Germany 27      </td></tr>
	<tr><td>Great Britain</td><td>25</td><td>Great Britain 25</td></tr>
	<tr><td>France       </td><td>19</td><td>France 19       </td></tr>
	<tr><td>South Korea  </td><td>18</td><td>South Korea 18  </td></tr>
	<tr><td>China        </td><td> 9</td><td>China 9         </td></tr>
</tbody>
</table>




```r
options(repr.plot.width=10, repr.plot.height=6)
```


```r
# Đầu tiên sẽ vẽ bar plot với highlight bar cho Brazil + Germany
# Tham khảo https://stackoverflow.com/questions/54103496/using-a-different-color-for-only-the-selected-bar-in-geom-bar

ggplot(ipsos, aes(x=Percent, y=Country)) +
    geom_col(aes(fill=ifelse(Country %in% c("Brazil", "Germany"), "Highlight", "Normal")), show.legend = F) + 
    scale_fill_manual(values=c("Highlight"="#ff00d2","Normal"="#becdd2"))
```


    
![png](/assets/01-Bar-chart-simple/output_6_0.png)
    



```r
#Vẽ back ground màu đan xen theo trục x
#Tìm hiểu nhiều chỗ thì chỉ có 1 cách là vẽ đè thêm sử dụng geom_rect()
#Tuy nhiên nhìn kĩ màu sẽ thấy 2 bar highlighted pop up hẳn lên, còn background và normal bar sẽ hòa màu
#Như vậy sẽ phải vẽ 2 bar highlight riêng ở 1 layer khác trong plot (đè lên)

bg_rect <- data.frame(start = c(0,20,40,60,80), 
                      end = c(20,40,60,80,100), 
                      color = rep(c("#e8f7fc", "#def5fc"), length.out = 5))
bg_rect
```


<table class="dataframe">
<caption>A data.frame: 5 × 3</caption>
<thead>
	<tr><th scope=col>start</th><th scope=col>end</th><th scope=col>color</th></tr>
	<tr><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;chr&gt;</th></tr>
</thead>
<tbody>
	<tr><td> 0</td><td> 20</td><td>#e8f7fc</td></tr>
	<tr><td>20</td><td> 40</td><td>#def5fc</td></tr>
	<tr><td>40</td><td> 60</td><td>#e8f7fc</td></tr>
	<tr><td>60</td><td> 80</td><td>#def5fc</td></tr>
	<tr><td>80</td><td>100</td><td>#e8f7fc</td></tr>
</tbody>
</table>




```r
#do data vẽ geom_rect khác với geom_col nên phải tách data về từng layer thay vì để chung ở plot ggplot()
#Tiếp tục tìm cách vẽ geo_col cho riêng 2 bar của Brazil và Germany

p1 <- ggplot() +
    geom_col(data = ipsos, mapping = aes(x=Percent, y=Country), fill="black") +
    geom_rect(data = bg_rect, mapping = aes(xmin = start,
                                            xmax = end, 
                                            ymin = 0, 
                                            ymax = 17),
                                            fill = bg_rect$color, alpha=0.8) +
    geom_col(data=ipsos, mapping = aes(x=Percent, y=Country, fill=ifelse(Country %in% c("Brazil", "Germany"), "Highlight", "Normal")), show.legend = F) + 
    scale_fill_manual(values=c("Highlight"="#ff00d2","Normal"="NA"))
p1
```


    
![png](/assets/01-Bar-chart-simple/output_8_0.png)
    



```r
#Vẽ line average, một bài viết sử dụng geom_hline() nhưng không giống lắm
#Thử nghiệm geom_segment với type arrow thử

p1 <- p1 + geom_segment(aes(x=45, y=-1, xend=45, yend=18), 
                  color="#6ca6cd", linewidth=0.5)
p1
```


    
![png](/assets/01-Bar-chart-simple/output_9_0.png)
    



```r
#Sửa label của y axis và x axis
#Dùng scale_y_discrete để control là gọn, tuy nhiên không control được thứ tự factor xuất hiện như dưới
#Đồng thời cũng khó để control việc bolder 1 element riêng biệt

p1 + scale_x_continuous(breaks = seq(0, 100, 20)) +
    scale_y_discrete(labels=paste(ipsos$Country, ipsos$Percent)) +
    labs(x=NULL, y=NULL) +
    theme(axis.text.y = element_text(margin=margin(r=-20)),
          panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          )

```


    
![png](/assets/01-Bar-chart-simple/output_10_0.png)
    



```r
#Fixed lỗi thứ tự xuất hiện của label
#Tham khảo: https://stackoverflow.com/questions/69678086/using-scale-y-discrete-to-include-variables-in-label-names-reorders-labels-wit
#Lý do: original data.frame is out of sync with what the discrete scale perceives to be the order
#Giải pháp: mutate thêm cột label name trong data.frame ngay trước khi fct_reorder

ggplot() +
    geom_col(data = ipsos, mapping = aes(x=Percent, y=Coulab), fill="black") +
    geom_rect(data = bg_rect, mapping = aes(xmin = start,
                                            xmax = end, 
                                            ymin = 0, 
                                            ymax = 17),
                                            fill = bg_rect$color, alpha=0.8) +
    geom_col(data=ipsos, mapping = aes(x=Percent, y=Coulab, fill=ifelse(Country %in% c("Brazil", "Germany"), "Highlight", "Normal")), show.legend = F) + 
    scale_fill_manual(values=c("Highlight"="#ff00d2","Normal"="NA")) +
    geom_segment(aes(x=45, y=-0.5, xend=45, yend=17.5), 
                  color="#6ca6cd", linewidth=0.5) +
    scale_x_continuous(breaks = seq(0, 100, 20)) +
    labs(x=NULL, y=NULL) +
    theme(axis.text.y = element_text(margin=margin(r=-20)),
          panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          )

```


    
![png](/assets/01-Bar-chart-simple/output_11_0.png)
    



```r
#Do đó sẽ sử dụng geom_text
#Nhưng không hiểu vì sao text lại bị hide đi rất kỳ lạ
#Lý do là geom_text vẽ ở vùng ngoài của plot, nên cần phải tăng plot margin lên
#Tham khảo: https://stackoverflow.com/questions/12409960/ggplot2-annotate-outside-of-plot
#Đồng thời tắt clip ở coord_cartesian
p1 + scale_x_continuous(breaks = seq(0, 100, 20)) +
    geom_text(data=ipsos, mapping=aes(x=-5, y=Country, label=paste(Country, Percent)), size=4, hjust=1) +
    labs(x=NULL, y=NULL) +
    coord_cartesian(clip="off") +
    theme(axis.text.y = element_blank(),
          panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          plot.margin = unit(c(1,1,1,4), "lines"),
         )

```


    
![png](/assets/01-Bar-chart-simple/output_12_0.png)
    



```r
#Trong version trên chú ý label China 9 trông không được cân đối
#Xử lý bằng cách format lại số percent cho đồng nhất 2 ký tự
#Nhưng do font không phải dạng mono nên dù có add space vào trước trông vẫn lệch

p1 + scale_x_continuous(breaks = seq(0, 100, 20)) +
    geom_text(data=ipsos, mapping=aes(x=-5, y=Country, label=paste(Country, format(Percent, width=2))), size=4, hjust=1) +
    labs(x=NULL, y=NULL) +
    coord_cartesian(clip="off") +
    theme(axis.text.y = element_blank(),
          panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          plot.margin = unit(c(1,1,1,4), "lines"),
         )
```


    
![png](/assets/01-Bar-chart-simple/output_13_0.png)
    



```r
#Quay về với cách trông không sạch sẽ cho lắm là add 2 layer geom_text

p1 + scale_x_continuous(breaks = seq(0, 100, 20)) +
    geom_text(data=ipsos, mapping=aes(x=-7, y=Country, label=Country), size=4, hjust=1) +
    geom_text(data=ipsos, mapping=aes(x=-3, y=Country, label=Percent), size=4, hjust=1) +
    labs(x=NULL, y=NULL) +
    coord_cartesian(clip="off") +
    theme(axis.text.y = element_blank(),
          panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          plot.margin = unit(c(1,1,1,4), "lines"),
         )
```


    
![png](/assets/01-Bar-chart-simple/output_14_0.png)
    



```r
ipsos <- mutate(ipsos,
                highlight_text=ifelse(Country == "Germany", "bold", "plain"))
ipsos
```


<table class="dataframe">
<caption>A tibble: 16 × 4</caption>
<thead>
	<tr><th scope=col>Country</th><th scope=col>Percent</th><th scope=col>Coulab</th><th scope=col>highlight_text</th></tr>
	<tr><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;chr&gt;</th></tr>
</thead>
<tbody>
	<tr><td>Indonesia    </td><td>93</td><td>Indonesia 93    </td><td>plain</td></tr>
	<tr><td>Turkey       </td><td>91</td><td>Turkey 91       </td><td>plain</td></tr>
	<tr><td>Brazil       </td><td>84</td><td>Brazil 84       </td><td>plain</td></tr>
	<tr><td>South Africa </td><td>83</td><td>South Africa 83 </td><td>plain</td></tr>
	<tr><td>USA          </td><td>70</td><td>USA 70          </td><td>plain</td></tr>
	<tr><td>India        </td><td>56</td><td>India 56        </td><td>plain</td></tr>
	<tr><td>Russia       </td><td>56</td><td>Russia 56       </td><td>plain</td></tr>
	<tr><td>Poland       </td><td>51</td><td>Poland 51       </td><td>plain</td></tr>
	<tr><td>Italy        </td><td>50</td><td>Italy 50        </td><td>plain</td></tr>
	<tr><td>Canada       </td><td>46</td><td>Canada 46       </td><td>plain</td></tr>
	<tr><td>Hungary      </td><td>29</td><td>Hungary 29      </td><td>plain</td></tr>
	<tr><td>Germany      </td><td>27</td><td>Germany 27      </td><td>bold </td></tr>
	<tr><td>Great Britain</td><td>25</td><td>Great Britain 25</td><td>plain</td></tr>
	<tr><td>France       </td><td>19</td><td>France 19       </td><td>plain</td></tr>
	<tr><td>South Korea  </td><td>18</td><td>South Korea 18  </td><td>plain</td></tr>
	<tr><td>China        </td><td> 9</td><td>China 9         </td><td>plain</td></tr>
</tbody>
</table>




```r
p1 + scale_x_continuous(breaks = seq(0, 100, 20)) +
    geom_text(data=ipsos, mapping=aes(x=-7, y=Country, label=Country, fontface=highlight_text), size=4, hjust=1) +
    geom_text(data=ipsos, mapping=aes(x=-3, y=Country, label=Percent, fontface=highlight_text), size=4, hjust=1) +
    labs(x=NULL, y=NULL) +
    coord_cartesian(clip="off") +
    theme(axis.text.y = element_blank(),
          panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          plot.margin = unit(c(1,1,1,4), "lines"),
         )
```


    
![png](/assets/01-Bar-chart-simple/output_16_0.png)
    



```r
#Thử nghiệm thay đổi font
library(extrafont)
loadfonts(device = "win")

p1 + scale_x_continuous(breaks = seq(0, 100, 20)) +
    geom_text(data=ipsos, mapping=aes(x=-7, y=Country, label=Country, fontface=highlight_text), size=4, hjust=1) +
    geom_text(data=ipsos, mapping=aes(x=-3, y=Country, label=Percent, fontface=highlight_text), size=4, hjust=1) +
    labs(x=NULL, y=NULL,
         title="'I Definitely Believe in God or a Supreme Being'",
         subtitle="was said in 2010 in:",
         caption="Source: www.ipsos-na.com, Design: Stefan Fichtel, ixtract") +
    coord_cartesian(clip="off") +
    theme(axis.text.y = element_blank(),
          panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          plot.margin = unit(c(2,1,1,4), "lines"),
          text = element_text(family="Lato"),
          plot.title = element_text(family="Lato Black"),
          plot.caption = element_text(face="italic")
         )
```


    
![png](/assets/01-Bar-chart-simple/output_18_0.png)
    



```r
#Add chú thích vào 1 chỗ nếu dùng geom_text khá costly bộ nhớ
#Và phải thêm 1 điểm vào data.frame riêng
#Thông thường nên dùng annotate()
#Tham khảo: https://stackoverflow.com/questions/10952832/ggplot2-is-there-a-fix-for-jagged-poor-quality-text-produced-by-geom-text


p1 + scale_x_continuous(breaks = seq(0, 100, 20)) +
    geom_text(data=ipsos, mapping=aes(x=-7, y=Country, label=Country, fontface=highlight_text, family = "Lato Light"), size=3, hjust=1) +
    geom_text(data=ipsos, mapping=aes(x=-3, y=Country, label=Percent, fontface=highlight_text, family = "Lato Light"), size=3, hjust=1) +
    annotate("text", x=44, y=17.5, label="Average 45", size=2, hjust=1, fontface="italic") +
    annotate("text", x=100, y=17.5, label="All values in percent", size=2, hjust=1, fontface="italic") +
    labs(x=NULL, y=NULL,
         title="'I Definitely Believe in God or a Supreme Being'",
         subtitle="was said in 2010 in:",
         caption="Source: www.ipsos-na.com, Design: Stefan Fichtel, ixtract") +
    coord_cartesian(clip="off") +
    theme(axis.text.y = element_blank(),
          panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          plot.margin = unit(c(2,1,1,4), "lines"),
          text = element_text(family="Lato Light"),
          plot.title = element_text(family="Lato Black"),
          plot.caption = element_text(face="italic")
         )

```


    
![png](/assets/01-Bar-chart-simple/output_19_0.png)
    



```r
ggsave("6.1.1 Bar Chart Simple.svg", last_plot(), device=svg, width = 20, height = 12, units="cm")
```

```r
ggsave("6.1.1 Bar Chart Simple.png", last_plot(), device=png, width = 20, height = 12, units="cm", bg="white")
```

**Final result**

**!AWESOME!** *(below image is in svg type, so you can open it in a separate tab and zoom it in)*
![Bar Chart Simple](/assets/01-Bar-chart-simple/Bar_Chart_Simple.svg)
