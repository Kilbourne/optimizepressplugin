;(function ($) {

    $(function() {
        var data = [
            OpStats.data,
            options = {
                series: {
                    bars: {
                        show: true,
                        barWidth: 0.9,
                        align: "center",
                        fill: true,
                        fillColor: "rgba(0,74,128,0.8)",
                        lineWidth: 0
                    },
                    color: "rgba(0,74,128,0.8)",
                    highlightColor: "rgba(0,74,128,1.0)"
                },
                xaxis: {
                    mode: "categories",
                    tickLength: 0
                },
                grid: {
                    show: true,
                    borderWidth: 0,
                    hoverable: true,
                    autoHighlight: true
                }
            }
        ];

        //Don't render chart if there is no optin boxes data
        if (typeof data[0] !== "undefined" && data[0].length === 0) {
            return;
        }
        
        $.plot("#optin_stats_chart", data, options);

        $('#optin_stats_chart').on("plothover", function (event, pos, item) {
            if (item) {
                if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                    previousPoint = item.dataIndex;
                    previousLabel = item.series.label;
                    $("#op_optin_stats_chart_tooltip").remove();

                    // var x = item.datapoint[0];
                    var y = item.datapoint[1];
                    var color = item.series.color;

                    // console.log(item.series.xaxis.ticks[x].label);
                    showTooltip(item.pageX, item.pageY, color, y);
                }
            } else {
                $("#op_optin_stats_chart_tooltip").remove();
                previousPoint = null;
            }
        });
    });

    var previousPoint = null;
    var previousLabel = null;

    function showTooltip(x, y, color, contents) {
        $('<div id="op_optin_stats_chart_tooltip">' + contents + '</div>').css({
            position: 'absolute',
            display: 'none',
            top: y - 15,
            left: x,
            border: '1px solid ' + color,
            padding: '3px 9px',
            opacity: 0.9,
            transform: 'translateX(-50%)',
            'border-radius': '3px',
            'font-size': '9px',
            'background-color': '#fff',
            'pointer-events': 'none',
        }).appendTo("body").fadeIn(200);
    }

}(opjq));
