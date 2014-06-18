define([
    
    'ash', 
    'game/components/behaviors/predator',
    'game/components/attributes/physics'

], function (Ash, Predator, Physics) {
 
	var PredatorNode = Ash.Node.create({
		predator: Predator,
		physics: Physics
    });

    return PredatorNode;
});
