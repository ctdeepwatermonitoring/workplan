library(geojsonio)

wps <- read.csv('data/2024/2024_workplan_draft_sites_040124.csv', header = TRUE)
sta <- read.csv('data/awx_stations_040123.csv', header = TRUE)
sta <- sta[,1:6]

wp <- merge(wps, sta, by = 'staSeq', all.x = TRUE)

wp$cnt <- 1
wp_rs <- reshape(wp[,c(1,2,8)], idvar = 'staSeq', 
                 timevar = 'type', direction = 'wide')
colnames(wp_rs) <- c("staSeq","Conductivity", "Temperature", "Stream Bio",
                     "Beach","Trail Cam","Lake")

wp_rs[is.na(wp_rs)] <- 0

wp_merge <- merge(wp_rs, wp, by = 'staSeq')
wp_merge$ylat <- as.numeric(wp_merge$ylat)
wp_merge$xlong <- as.numeric(wp_merge$xlong)

wp_merge <- wp_merge[complete.cases(wp_merge),]


geojson_write(wp_merge, lat = "ylat", lon = "xlong", file = "wpSites24.geojson")




