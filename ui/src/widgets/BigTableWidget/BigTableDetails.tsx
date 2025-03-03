import React from "react";

import Box from "@material-ui/core/Box";

import {BigGraphWidgetParams, BigTableRowDetails, DetailsPart, WidgetInfo, WidgetSize} from "../../api/Api";

import DashboardContext, {DashboardContextState} from "../../contexts/DashboardContext";

import AutoTabs from "../../components/AutoTabs";
import LoadableView from "../../components/LoadableVIew";

import BigGraphWidgetContent from "../BigGraphWidgetContent";
import InsightBlock from "../InsightBlock";
import {WidgetRenderer} from "../WidgetRenderer";
import NotImplementedWidgetContent from "../NotImplementedWidgetContent";

interface BigTableDetailsProps {
    details: BigTableRowDetails;
    widgetSize: WidgetSize;
}

const GetType = (part: DetailsPart) => part.type ?? "graph";

const RenderPart = (context: DashboardContextState, part: DetailsPart, widgetSize: number) => {
    switch (GetType(part)) {
        case "graph": {
            const get = () => context.getAdditionGraphData(part.id);
            const render = (params: BigGraphWidgetParams) => <BigGraphWidgetContent {...params}
                                                                                    widgetSize={widgetSize}/>;
            return <LoadableView func={get}>{render}</LoadableView>;
        }
        case "widget": {
            const get = () => context.getAdditionWidgetData(part.id);
            const render = (params: WidgetInfo) => WidgetRenderer(part.id, params);
            return <LoadableView func={get}>{render}</LoadableView>;
        }
        default:
            return <NotImplementedWidgetContent/>
    }
}


export const BigTableDetails: React.FunctionComponent<BigTableDetailsProps> = (props) => {

    return <DashboardContext.Consumer>{
        dashboardContext =>
            <Box>
                {props.details.parts.length > 1 ? <AutoTabs tabs={props.details.parts.map(part =>
                        ({
                            title: part.title,
                            tab: RenderPart(dashboardContext, part, props.widgetSize),
                        })
                    )}/>
                    : RenderPart(dashboardContext, props.details.parts[0], props.widgetSize)}
                {
                    props.details.insights === undefined ? <></>
                        : props.details.insights.map(row => <InsightBlock data={row}/>)
                }
            </Box>
    }</DashboardContext.Consumer>;
}