library(ggplot2)

setwd('C:/Users/deepuser/Documents/Projects/ProgramDev/workplan/analysis/')

write.csv(bug_sites, 'data/bug_sites_032323.csv', row.names = FALSE)

bug_s_yr <- aggregate(Year~staSeq, data=bug_sites, FUN="length")

bug_s_yr$grp <- ifelse(bug_s_yr$Year >= 20, "20 +",
                       ifelse(bug_s_yr$Year >= 15, "15-19",
                              ifelse(bug_s_yr$Year >= 10, "10-14",
                                     ifelse(bug_s_yr$Year >= 5, "5-9", "<5"))))
bug_s_yr$grp <- factor(bug_s_yr$grp, 
                       levels=c("<5","5-9","10-14","15-19", "20 +"))

lt_sites <- merge(bug_s_yr[bug_s_yr$Year>4,],
                  bug_sites[,c('staSeq','ylat','xlong')],by = 'staSeq')
lt_sites <- unique(lt_sites[c('staSeq','Year','grp','ylat','xlong')])

write.csv(lt_sites,"data/Long_Term_Bug_Sites.csv", row.names = FALSE )



ggplot(bug_s_yr[bug_s_yr$Year>4,], aes(grp))+
  geom_bar()+
  ylim(0, 100)+
  xlab("Number of Years")+
  ylab("Number of Sites")+
  labs(title="Long-term Biologicial Monitoring Sites in Connecticut 1987 - 2021")+
  theme_bw()