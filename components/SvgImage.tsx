import { PATHS_BACK_DATA, PATHS_FRONT_DATA } from "@/helperFiles/svgPathMaps";
import * as React from "react";
import { G, Path, Svg } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: title */
interface SVGRProps {
    title?: string;
    titleIds: string[];
    color?: string;
}
/* SVGR has dropped some elements not supported by react-native-svg: title */
const SvgComponent = (props: SVGRProps) => (
    <Svg
        width="250"
        height="250"
        viewBox="0 0 535 509"
        id="svg1">
        <G
            id="layer1"
            fill="#ffff00"
            transform="scale(3.7795277,3.7944369)"
        >
            <G
                id="Back"
                transform="matrix(3.1351703,0,0,3.1577617,-0.37674473,-0.1783789)"
                display="inline"
            >
                {
                    PATHS_BACK_DATA.map((path) => {
                        const isMatched = props.titleIds.includes(path.id)

                        return (
                            <Path
                                key={path.id}
                                id={path.id}
                                d={path.d}
                                strokeWidth="0.264583"
                                fill={isMatched ? "#e70707ff" : "#999999"} 
                            />
                        )
                    })
                }
            </G>
            <G
                id="Front"
                display="inline;fill:#ffff00"
                transform="matrix(3.160825,0,0,3.1577617,-0.44569507,-0.1783789)"
            >
                {
                    PATHS_FRONT_DATA.map((path) => {
                        const isMatched = props.titleIds.includes(path.id)

                        return (
                            <Path
                                key={path.id}
                                id={path.id}
                                d={path.d}
                                strokeWidth="0.264583"
                                fill={isMatched ? "#e70707ff" : "#999999"} 
                            />
                        )
                    })
                }
            </G>
        </G>
    </Svg>
)
export default SvgComponent