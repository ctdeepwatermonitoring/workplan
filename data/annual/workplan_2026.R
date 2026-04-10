library(geojsonio)

wps <- read.csv('data/annual/2026_workplan_draft_sites_041026.csv', header = TRUE)

wp <- wps[order(wps$type),]
wp$cnt <- 1

wp_rs <- reshape(wp[,c(1,5,6)], idvar = 'staSeq', 
                 timevar = 'type', direction = 'wide')
colnames(wp_rs) <- c("staSeq", "Beach", "Biological","Chem Only", 
                     "Conductivity", "Lake", "LIS",
                     "Stream Connectivity", "Temperature")

wp_rs[is.na(wp_rs)] <- 0

wp_merge <- merge(wp_rs, wps[ ,c(1:5)], by = 'staSeq')
wp_merge$ylat <- as.numeric(wp_merge$ylat)
wp_merge$xlong <- as.numeric(wp_merge$xlong)

wp_merge <- wp_merge[complete.cases(wp_merge),]


geojson_write(wp_merge, lat = "ylat", lon = "xlong", file = "wpSites26.geojson")




