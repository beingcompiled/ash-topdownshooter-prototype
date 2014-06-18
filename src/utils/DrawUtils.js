var DrawUtils = (function() { 
	return {
		
		// random number between
		drawHexagon : function(g, numSides, size) {

			var Xcenter = 25,
				Ycenter = 25;

			g.moveTo(
				Xcenter + size * Math.cos(0), 
				Ycenter + size * Math.sin(0)
			);          

			for (var i=1; i<=numSides; i++) {
			    g.lineTo(
					Xcenter + size * Math.cos(i * 2 * Math.PI / numSides), 
					Ycenter + size * Math.sin(i * 2 * Math.PI / numSides)
			    );
			}
			return g;
		}
	};
})();