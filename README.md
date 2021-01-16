# flowexcercise 

Accepts a search term and returns matching movies from omdbapi.com.  Results are sorted by year of release (descending) then by movie title (ascending).  

Click a movie title to see details about that movie.

*To run, you will need to supply an omdbapi.com API key in a separate file named apikey.js, or define it in main.js*

Overall I spent about three hours on this exercise.  I did have to do a fair amount of Googling to refresh my memory on some of the vanilla JavaScript syntax for working with the DOM (e.g. Template tags, etc.)

I built this as a procedural implementation in plain Javascript in the interest of time, and also because that's the mindset and language flavor I have been in lately in programming Dojo widgets.  I've tested it primarly in Chrome 87 and Firefox 84, where it appears as designed, and in Safari 14 where some of the styles do not render as expected.  I did not fix these Safari issues in the interest of time.
