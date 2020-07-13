'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    function ordinal(i) {
        let left = cardinal[(i - 4) / 8];
        let rigth = cardinal[(i + 4) / 8];

        let abbr;
        if (left == 'E' || left == "W") {
            abbr = rigth + left;
        } else {
            abbr = left + rigth;
        }
        return abbr;
    }

    var cardinal = ['N', 'E', 'S', 'W'];  // use array of cardinal directions only!
    var result = [];
    cardinal.push("N");
    for (let i = 0; i < 32; i++) {
        let az = i * 11.25;
        if (i % 8 == 0) {
            result.push({ abbreviation: cardinal[i / 8], azimuth: az });
        } else if (i % 4 == 0) {
            let abbr = ordinal(i);
            result.push({ abbreviation: abbr, azimuth: az });
        } else if (i % 2 == 0) {
            //nearest cardinal            
            let mod = i % 8;
            let left = (mod == 2) ? (cardinal[(i - 2) / 8]) : (cardinal[(i + 2) / 8]);
            //nearest ordinal
            let j = (mod == 2) ? i + 2 : i - 2;
            let rigth = ordinal(j);
            let abbr = left + rigth;
            result.push({ abbreviation: abbr, azimuth: az });
        } else {
            let mod = i % 4;
            let j = (mod == 1) ? i - 1 : i + 1;

            let nearPrincipal;
            let nearCardinal;

            if (j % 8 == 0) {
                nearPrincipal = cardinal[j / 8];
                nearCardinal = (mod == 1) ? cardinal[j / 8 + 1] : cardinal[j / 8 - 1];
            } else {
                nearPrincipal = ordinal(j);
                nearCardinal = (mod == 1) ? cardinal[(j + 4) / 8] : cardinal[(j - 4) / 8];
            }
            let abbr = nearPrincipal + "b" + nearCardinal;
            result.push({ abbreviation: abbr, azimuth: az });
        }
    }
    return result;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
var prev=[];

function* expandBraces(str) {
    let matches = str.match(/({[^{]*?})/);
    if (matches == null) {
        if (prev.indexOf(str)==-1){
            prev.push(str);
            yield str;
        }
    } else {
        let m = matches[1];
        let strVars = m.slice(1, m.length - 1);
        let vars = strVars.split(",");
        for (let v of vars) {
            yield* expandBraces(str.replace(m, v));
        }
    }


}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 * 
 * 
 *    5=> 0 1 5 6 14
 *        2 4 7 13 0
 *        3 8 12 0 0
 *        9 11 0 0 0 
 *        10 0 0 0 0
 *  
 *  i = 0-01-210-0123-321-23-3
 *  j = 0-10-012-3210-123-32-3
 *  
 */
function getZigZagMatrix(n) {
    let arr=Array(n);
    for (let i=0;i<n;i++){
        arr[i]=Array(n);
        arr[i].fill(0);
    }    
    let goingUp=true;
    let counter=0;
    for (let k=1;k<n;k++){
        if (goingUp){
            for (let i=0;i<=k;i++){
                arr[i][k-i]=++counter;
            }
            goingUp=false;
        }
        else{
            for (let i=k;i>=0;i--){
                arr[i][k-i]=++counter;
            }
            goingUp=true;
        }        
    }

    for (let k=1;k<n;k++){
        if (goingUp){
            for (let i=k;i<n;i++){
                arr[i][n+k-1-i]=++counter;
            }
            goingUp=false;
        } else{
            for (let i=n-1;i>=k;i--){
                arr[i][n+k-1-i]=++counter;
            }
            goingUp=true;
        }
    }
    return arr;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    throw new Error('Not implemented');
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    throw new Error('Not implemented');
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
