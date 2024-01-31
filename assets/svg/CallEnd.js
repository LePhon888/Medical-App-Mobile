import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg width={22.882} height={7.844} viewBox="0 0 22.882 7.844" {...props}>
            <Path
                d="M11.441 1.771a15.2 15.2 0 00-4.386.637v2.749a.889.889 0 01-.534.8A11.116 11.116 0 003.98 7.595a.991.991 0 01-.667.252.969.969 0 01-.672-.261L.281 5.392a.843.843 0 010-1.257A16.829 16.829 0 0111.441 0 16.829 16.829 0 0122.6 4.134a.846.846 0 01.281.629.836.836 0 01-.281.624l-2.36 2.191a.989.989 0 01-.672.261 1 1 0 01-.667-.252 11.117 11.117 0 00-2.541-1.638.889.889 0 01-.534-.8V2.4a15.349 15.349 0 00-4.385-.629z"
                fill="#fff"
            />
        </Svg>
    )
}

export default SvgComponent