sites <- read.csv('data/awx_stations_033123.csv',header=TRUE)
wp_sites <- read.csv('data/2023/workplan_sites_draft_2023.csv', header=TRUE)

wp <- merge(sites[,c(1,2,4,5,6,11,12,13)],wp_sites,by='staSeq')

write.csv(wp, 'data/2023/draft_workplan_2023.csv', row.names=FALSE)

wp$cnt <- 1
wp_rs <- reshape(wp[,c(1,9,11)], idvar = 'staSeq', 
                 timevar = 'type', direction = 'wide')
colnames(wp_rs) <- c("staSeq","Temperature","Conductivity",
                     "Biological","Trail Cam","Beach","Lake")

wp_rs[is.na(wp_rs)] <- 0

wp_merge <- merge(wp_rs, wp[,c(1:5,9)],by.x = 'staSeq')




