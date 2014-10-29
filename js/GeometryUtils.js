THREE.GeometryUtils.randomPointsInBufferGeometry = function ( geometry, n ) {

	
	var i,
		vertices = geometry.attributes.position.array,
		totalArea = 0,
		cumulativeAreas = [],
		vA, vB, vC;

	// precompute face areas
	vA = new THREE.Vector3();
	vB = new THREE.Vector3();
	vC = new THREE.Vector3();

	// geometry._areas = [];
	var il = vertices.length / 9;

	for ( i = 0; i < il; i ++ ) {

		vA.set( vertices[i * 9 + 0], vertices[i * 9 + 1], vertices[i * 9 + 2] );
		vB.set( vertices[i * 9 + 3], vertices[i * 9 + 4], vertices[i * 9 + 5] );
		vC.set( vertices[i * 9 + 6], vertices[i * 9 + 7], vertices[i * 9 + 8] );

		area = THREE.GeometryUtils.triangleArea( vA, vB, vC );
		totalArea += area;

		cumulativeAreas.push(totalArea);
	}

	// binary search cumulative areas array

	function binarySearchIndices( value ) {

		function binarySearch( start, end ) {

			// return closest larger index
			// if exact number is not found

			if ( end < start )
				return start;

			var mid = start + Math.floor( ( end - start ) / 2 );

			if ( cumulativeAreas[ mid ] > value ) {

				return binarySearch( start, mid - 1 );

			} else if ( cumulativeAreas[ mid ] < value ) {

				return binarySearch( mid + 1, end );

			} else {

				return mid;

			}

		}

		var result = binarySearch( 0, cumulativeAreas.length - 1 )
		return result;

	}

	// pick random face weighted by face area

	var r, index,
		result = [];

	for ( i = 0; i < n; i ++ ) {

		r = THREE.Math.random16() * totalArea;

		index = binarySearchIndices( r );

		// result[ i ] = THREE.GeometryUtils.randomPointInFace( faces[ index ], geometry, true );
		vA.set( vertices[index * 9 + 0], vertices[index * 9 + 1], vertices[index * 9 + 2] );
		vB.set( vertices[index * 9 + 3], vertices[index * 9 + 4], vertices[index * 9 + 5] );
		vC.set( vertices[index * 9 + 6], vertices[index * 9 + 7], vertices[index * 9 + 8] );
		result[ i ] = THREE.GeometryUtils.randomPointInTriangle( vA, vB, vC );

	}

	return result;

}
