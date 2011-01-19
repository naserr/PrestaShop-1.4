/*
* 2007-2010 PrestaShop 
*
* NOTICE OF LICENSE
*
* This source file is subject to the Open Software License (OSL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/osl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author Prestashop SA <contact@prestashop.com>
*  @copyright  2007-2010 Prestashop SA
*  @version  Release: $Revision: 1.4 $
*  @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
*  International Registred Trademark & Property of PrestaShop SA
*/

$(document).ready(function()
{
	updateAddressesDisplay(true);
});

//update the display of the addresses
function updateAddressesDisplay(first_view)
{
	// update content of delivery address
	updateAddressDisplay('delivery');

	// update content of invoice address
	//if addresses have to be equals...
	var txtInvoiceTitle = $('ul#address_invoice li.address_title').html();	
	if ($('input[type=checkbox]#addressesAreEquals:checked').length == 1)
	{
		$('#address_invoice_form:visible').hide('fast');
		$('ul#address_invoice').html($('ul#address_delivery').html());
		$('ul#address_invoice li.address_title').html(txtInvoiceTitle);
	}
	else
	{
		$('#address_invoice_form:hidden').show('fast');
		if ($('select#id_address_invoice').val())
			updateAddressDisplay('invoice');
		else
		{
			$('ul#address_invoice').html($('ul#address_delivery').html());
			$('ul#address_invoice li.address_title').html(txtInvoiceTitle);
		}	
	}
	
	if(!first_view)
	{
		if (orderProcess == 'order')
			updateAddresses();
	}
	
	return true;
}

function updateAddressDisplay(addressType)
{	
	if (addresses.length <= 0)
		return false;
	
	var idAddress = $('select#id_address_' + addressType + '').val();
	$('ul#address_' + addressType + ' li.address_company').html(addresses[idAddress][0]);
	if(addresses[idAddress][0] == '')
		$('ul#address_' + addressType + ' li.address_company').hide();
	else
		$('ul#address_' + addressType + ' li.address_company').show();
	$('ul#address_' + addressType + ' li.address_name').html(addresses[idAddress][1] + ' ' + addresses[idAddress][2]);
	$('ul#address_' + addressType + ' li.address_address1').html(addresses[idAddress][3]);
	$('ul#address_' + addressType + ' li.address_address2').html(addresses[idAddress][4]);
	if(addresses[idAddress][4] == '')
		$('ul#address_' + addressType + ' li.address_address2').hide();
	else
		$('ul#address_' + addressType + ' li.address_address2').show();
	$('ul#address_' + addressType + ' li.address_city').html(addresses[idAddress][5] + ' ' + addresses[idAddress][6]);
	$('ul#address_' + addressType + ' li.address_country').html(addresses[idAddress][7] + (addresses[idAddress][8] != '' ? ' (' + addresses[idAddress][8] +')' : ''));
	// change update link
	var link = $('ul#address_' + addressType + ' li.address_update a').attr('href');
	var expression = /id_address=\d+/;
	link = link.replace(expression, 'id_address='+idAddress);
	$('ul#address_' + addressType + ' li.address_update a').attr('href', link);
}

function updateAddresses()
{
	var idAddress_delivery = $('select#id_address_delivery').val();
	var idAddress_invoice = $('input[type=checkbox]#addressesAreEquals:checked').length == 1 ? idAddress_delivery : $('select#id_address_invoice').val();
   
   $.ajax({
           type: 'POST',
           url: baseDir + 'order.php',
           async: true,
           cache: false,
           dataType : "json",
           data: 'processAddress=true&step=2&ajax=true&id_address_delivery=' + idAddress_delivery + '&id_address_invoice=' + idAddress_invoice+ '&token=' + static_token ,
           success: function(jsonData)
           {
           		if (jsonData.hasError)
				{
					var errors = '';
					for(error in jsonData.errors)
						//IE6 bug fix
						if(error != 'indexOf')
							errors += jsonData.errors[error] + "\n";
					alert(errors);
				}
			},
           error: function(XMLHttpRequest, textStatus, errorThrown) {alert("TECHNICAL ERROR: unable to save adresses \n\nDetails:\nError thrown: " + XMLHttpRequest + "\n" + 'Text status: ' + textStatus);}
       });
}