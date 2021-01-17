;(function($){
    var parent_win = window.dialogArguments || opener || parent || top;
    $(document).ready(function(){
        if(OptimizePress.media_disable_url == 'Y'){
            $('#tab-type_url').remove();
        }
        if($('#tab-type_url a').hasClass('current')){
            var el = $('div.media-item.media-blank'),
                tbl = el.find('table'),
                btn = $('#go_button').length;
            el.find('p.media-types').remove();
            tbl.find('tr:gt(0)').remove().end().find('tbody').append('\
        <tr class="image-only">\
            <td></td>\
            <td>\
                <input type="button" class="button" id="go_button" style="color:#'+(btn > 0 ? 'bbb': '333')+'" />\
            </td>\
        </tr>');
            $('#go_button').val(OptimizePress.media_insert).click(function(e){
                e.preventDefault();
                var el = tbl.find(':text:first'), val = el.val();
                if(val != ''){
                    parent_win.op_attach_file('url',val);
                }
            });
        }
        $('p.ml-submit').remove();
        $('#library-form,#file-form').submit(function(e){
            if($('#html-upload-ui:visible').length == 0){
                e.preventDefault();
            }
        });
        $('#file-form').attr('action',$('#file-form').attr('action')+'&op_uploader=true');
        $('#filter').append('<input type="hidden" name="op_uploader" value="true" />');
        $('body').on('click', 'tr.submit :submit', function(e){
            e.preventDefault();
            var item_id = $(this).attr('id').split('[')[1].split(']')[0];
            //var item_id = $(this).closest('.media-item').attr('id').split('-'), size = null;
            //item_id = item_id[item_id.length-1];
            if($('#type-of-'+item_id).val() == 'image'){
                size = $('tr.image-size :radio:checked','#media-item-'+item_id).val();
            } else {
                size = 0;
            }
            parent_win.op_attach_file('wp',item_id,size);
        });
    });
}(opjq));