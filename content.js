MutationObserver = window.WebKitMutationObserver
glob = {"count":1}
observer = new MutationObserver(function(mutations, observer) {update()});

observer.observe(document.getElementsByClassName("_1qkq _1qkx")[0], {
            subtree: true,
            childList: true,
            attributes: false
        }); 

update()

function insert_alpha(string, likes) {
	alpha = 0.45
	if (likes == -1) {
		alpha = 0.1
	}
	if(likes > 10){
		alpha = .6
	}
	if(likes > 20) {
		alpha = .8
	}
	if(likes > 50) {
		alpha = .9
	}
	if(likes > 100) {
		alpha = 1.
	}

	ind = string.indexOf("alpha")
	string = string.substring(0, ind) + alpha +")"
	return string	
}

function pick_color(html) {
	shadow_color = "rgba(0, 0, 255, alpha)"
	topics = ["cons", "liberal", "healthcare", "test", "climate"]
	color = {"cons": ["donald trump", "trump", "mike pence", "fox news",
					   "nationalreview.com", "breitbart", "melania", "liberal media",
					   "obummer", "bannon", "ivanka"], 
         "cons_color": "rgba(0, 0, 255, alpha)", // blue
		 "liberal": ["sanders", "progressive", "liberals", "resist", "democrat", "lago",
		 			 "privacy", "abortion", "union", "livable wage", "minimum wage", "aclu"],
		 "liberal_color": "rgba(255, 165, 0, alpha)", //orange
		 "healthcare": ["healthcare", "obamacare", "affordable care act", "contraceptives",
		 				"clinic", "abortion", "planned parenthood", "pills"],
		 "healthcare_color": "rgba(0, 255, 0, alpha)", //green
		 "test": ["sublet", "apartment", "rent", "housing", "bedroom"],
		 "test_color": "rgba(255, 0, 0, alpha)", //red
		 "climate": ["global warming", "climate", "climate change", "ice caps", "weather"],
		 "climate_color": "rgba(255, 0, 255, alpha)",//teal
		}

	max_score = 0
	max_ind = -1

	txt = html.innerText.toLowerCase()
	like_ind = html.innerHTML.indexOf("_4arz")
	if(like_ind==-1){
		likes = 0
	}
	else {
		str = html.innerHTML.substring(like_ind, like_ind+400)
		likes = process_likes(str)

	}

	for(i=0;i<topics.length; i++) {
		// For each topic
		topic = topics[i]
		kwords = color[topic]
		score = 0
		for(j=0;j<kwords.length;j++) {
			// for each keyword
			strind = txt.indexOf(kwords[j])
			if(strind == -1) {
				strind = false
			}
			else{
				strind = true
			}
			score = score + strind
		}
		score = score / kwords.length
		if(score > max_score){
			max_ind = i
			max_score = score
		}
	}
	if(max_ind == -1) {
		return -1
	}
	picked_color = topics[max_ind] + "_color"
	return insert_alpha(color[picked_color], -1)+"; box-shadow: 10px 0px 5px " + insert_alpha(shadow_color, likes)
}

categories = "Editor"+ "TV Network"+ "TV Show"+ "Public Figure"+ "Journalist"+ "News Personality"+
					"Lawyer"+ "Business Person"+ "Entertainer"+ "Politician"+ "Government Official"+ "Media/News Company"+
					"Industrials"+ "Education"+ "Political Organization"+ "Community/Government"+ "Political Party" + "News/Media Website"
					+ "Newspaper" + "TV Network"+ "Broadcasting & Media Production Company" + "Media/News Company"


function add_storage(element) {
	auth = ""
	n = element.getElementsByTagName("a")
	for(i = 0; i < n.length; i++) {
		link = n[i].getAttribute('href')
		if(n[i].getAttribute("data-hovercard-obj-id") != null) {
			//page
			id = n[i].getAttribute("data-hovercard-obj-id")
			// page_id: Flag whether we've seen it before
			// page_id_valid: Whether it's a page we want to track
			// page_id_count: How many times encountered before
			if (String(id) in window.glob) {
				// May be valid
				if (window.glob[String(id)+"_valid"]) {
					window.glob[String(id)] = window.glob[String(id)]+1
					window.glob["count"] = window.glob["count"] + 1
				}
			}
			else {
				window.glob[String(id)] = 0

				xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
				  if (this.readyState == 4 && this.status == 200) {
				  	res = this.response
					res = JSON.parse(res)
					cat = res['category']
					ked = categories.indexOf(cat)
					if(ked !== -1) {
						if(typeof res['likes'] === 'undefined') {
							return -1
						}
						likes = res['likes']['data']
						window.glob[String(res['id'])+"_valid"] = true
						window.glob[String(res['id'])+"_likes"] = likes
						return;
					}


					cat = res['category_list']
					if(typeof res['likes'] === 'undefined') {
						return -1
					}
					likes = res['likes']['data']
					if(typeof cat === 'undefined') {
						return -1
					}
					for(j = 0; j < cat.length; j++) {
						ked = categories.indexOf(cat[j]["name"])

						if(ked == -1) {
							// not interested, skip and mark
							window.glob[String(res['id'])+"_valid"] = false
							return -1
						}
					}
					window.glob[String(res['id'])+"_valid"] = true
					window.glob[String(res['id'])+"_likes"] = likes
					return;
				  }
				};
				xhttp.open("GET", "https://graph.facebook.com/v2.9/"+id+"?fields=category_list,category,about,description,likes{picture,id,category}&access_token="+auth, true);
				xhttp.send();
			}
		}
	}
	return String(id)
}


function style2(node, color, freq, alt_url1, alt_url2) {
	//alt_url is a list [icon_url, fb_url]
	// Color: hexcode 0x######
// 	<div class="dropdown">
//   <button class="dropbtn">Dropdown</button>
//   <div class="dropdown-content">
//     <a href="#">Link 1</a>
//     <a href="#">Link 2</a>
//     <a href="#">Link 3</a>
//   </div>
// </div>
	element = document.createElement("div")
	element.className = "dropdown"
	element.style="padding-top:10px;padding-bottom:0px; padding-right:10px; padding-left:10px;width:100%"
	btn = document.createElement("container")
	btn.className = "btn btn-primary btn-lg round"
	//btn.style.height = "500%"
	//btn.style.width = "96%"
	//btn.style.margin="10px"
	btn.style.backgroundColor = color
	btn.style.width = "90%"
	// check out: https://www.w3schools.com/w3css/w3css_buttons.asp to mess around
	// btn.style.(attribute) = "whatever"
	// btn.innerHTML="<span class='glyphicon glyphicon-eye-open'></span>"
	//btn.textContent = "C"
	element.appendChild(btn)

	icon = document.createElement("img")
	icon.src = "https://raw.githubusercontent.com/Eschew/colorfeed/master/lastonepleasegod.gif"
	icon.style.width="4%"
	icon.style.height = "4%"
	icon.align = "right"
	btn.appendChild(icon)

	inside = document.createElement("div")
	inside.className="dropdown-content"
	inside.style="padding:10px;width:55%"
	element.appendChild(inside)

	// Add shit in here

	header = document.createElement("h1")
	str = String(freq)
	console.log(freq)
	percent = str.substring(2, 4)+"."+str.substring(4,6)
	header.textContent = "This source appears in your News Feed "+ percent+"% of the time."
	inside.append(header)
	inside.append(document.createElement("br"))

	bar_div = document.createElement("div")
	bar_div.className = "progress"
	bar = document.createElement("div")
	bar.className = "progress-bar-info"
	bar.style.height = "15px"
	bar.setAttribute("role", "progressbar")
	bar.setAttribute("aria-valuenow", freq)
	bar.setAttribute("aria-valuemin", "0")
	bar.setAttribute("aria-valuemax", "1")
	bar.style.width=percent+"%"
	bar_div.append(bar)
	inside.append(bar_div)
	inside.append(document.createElement("br"))


	header = document.createElement("h1")
	header.textContent = "Check out some more related sources:"
	inside.append(header)
	inside.append(document.createElement("br"))

	others = document.createElement("div")
	others.style="width:100%"
	inside.append(others)

	child1 = document.createElement("div")
	child1_center = document.createElement("center")
	child1.append(child1_center)
	child2 = document.createElement("div")
	child2_center = document.createElement("center")
	child2.append(child2_center)

	others.appendChild(child1)
	others.appendChild(child2)

	child1.style="display:inline-block;align:center;width:50%"
	child2.style="display:inline-block;align:center;width:50%"

	link1 = document.createElement("a")
	child1_center.append(link1)
	inner_im1 = document.createElement("img")
	link1.append(inner_im1)

	link2 = document.createElement("a")
	child2_center.append(link2)
	inner_im2 = document.createElement("img")
	link2.append(inner_im2)

	inner_im1.src = alt_url1[0]
	inner_im2.src = alt_url2[0]
	link1.href = alt_url1[1]
	link1.target="_blank"
	link2.href = alt_url2[1]
	link2.target="_blank"
	inner_im1.style="width:50%"
	inner_im2.style="width:50%"
	node.prepend(element)
}

function sim_link(id) {
	data = glob[id + "_likes"]
	if(typeof data === 'undefined') {
		return -1
	}
	attempts = 0
	while (true) {
		first = Math.floor(Math.random()*data.length)
		attempts = attempts + 1
		if (attempts > 50) {
			return -1
		}
		if(categories.indexOf(data[first]['category']) !== -1) {
			continue
		}
		else {
			break;
		}
	}
	attempts = 0
	while (true) {
		second = Math.floor(Math.random()*data.length)
		attempts = attempts + 1
		if(categories.indexOf(data[second]['category']) !== -1 && second !== first) {
			break
		}
		if (attempts > 60) {
			return -1
		}
	}

	if("picture" in data[first]) {
		d1 = data[first]['picture']['data']['url']
	}
	else {
		d1 = data[first]['data']['data']['url']
	}
	id1 = data[first]["id"]
	id2 = data[second]["id"]

	if("picture" in data[second]) {
		d2 = data[second]['picture']['data']['url']
	}
	else {
		d2 = data[second]['data']['data']['url']
	}
	return [[d1 , "https://www.facebook.com/"+id1],
			[d2, "https://www.facebook.com/"+id2]]
}

function get_ranking(id, thresh) {
	console.log(window.glob)
	count2 = window.glob['count']
	freq = {}
	for(var key in window.glob) {
		if(key.indexOf('_') !== -1) {
			continue;
		}
		freq[key] = window.glob[key]/count2
	}

	// Create items array
	var items = Object.keys(freq).map(function(key) {
	    return [key, freq[key]];
	});

	// Sort the array based on the second element
	items.sort(function(first, second) {
	    return second[1] - first[1];
	});

	// Create a new array with only the top thresh items
	sorted = items.slice(0, thresh)
	for (i = 0; i < sorted.length; i ++) {
		if(id == sorted[i][0]) {
			// Return high freq
			return [1, freq[id]]
		}
	}
	// Return low freq
	return [0, freq[id]]
}

function pick_color3(high) {
	console.log(high)
	low_freq = ["#0FFCE0",
				"#FFA00D",
				"#FEFF1F",
				"#7E42FF",
				"#E8E80A",
				"#FF5300",
				"#CC14B7",
				"#FFDD4C",
				"#4CF8A8",
				"#D148FA",
				"#F45398",
				"#FA237F",
				"#A0FC33",
				"#01C91B",
				"#FFCE00",
				"#02FE52",]
	high_freq = ['#877f83',
				'#897a91',
				'#a39e80',
				'#7f967e',
				'#7f8c69',
				'#a8b6b7',
				'#8c7e86',
				'#22595e',
				'#779187',
				'#c7d1e0',
				'#bec6d8',
				'#abbcd6',
				'#687c73',
				'#6d6259',
				'#667f6b',
				'#8e8a9b',]
	if (high == 1) {
		n = Math.floor(Math.random()*high_freq.length)
		return high_freq[n]

	}
	n = Math.floor(Math.random()*low_freq.length)
	return low_freq[n]
}

function update() {
	run = document.getElementsByClassName("_4-u2 mbm _4mrt _5v3q _4-u8")

	for(count = 0; count < run.length; count++) {
		if(run[count].getAttribute("cf_seen") == null){
			run[count].setAttribute("cf_seen", true)
		}
		else{
			continue
		}
		t = add_storage(run[count])
		if(t == -1) {
			// skip
			continue
		}
		if(window.glob['count'] < 10) {
			continue
		}
		links = sim_link(t)
		if(links == -1) {
			continue
		}
		rank = get_ranking(t, 3)
		color = pick_color3(rank[0])
		style2(run[count], color, rank[1], links[0], links[1])
	}
	return
}
