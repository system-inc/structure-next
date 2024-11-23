'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import AccountMenuButton from '@structure/source/modules/account/components/AccountMenuButton';
import Button from '@structure/source/common/buttons/Button';
import Menu from '@structure/source/common/menus/Menu';
import PopoverMenu from '@structure/source/common/popovers/PopoverMenu';
import Alert from '@structure/source/common/notifications/Alert';
import FormInputText from '@structure/source/common/forms/FormInputText';
import InputSelect from '@structure/source/common/forms/InputSelect';
import InputMultipleSelect from '@structure/source/common/forms/InputMultipleSelect';
import { InputCheckboxState, InputCheckbox } from '@structure/source/common/forms/InputCheckbox';
import FormInputCheckbox from '@structure/source/common/forms/FormInputCheckbox';
import FormInputSelect from '@structure/source/common/forms/FormInputSelect';
import { Form } from '@structure/source/common/forms/Form';
import { DatabaseAndTableFormInputSelects } from '@structure/source/internal/pages/developers/databases/DatabaseAndTableFormInputSelects';
import { FormInputDate } from '@structure/source/common/forms/FormInputDate';
import { InputDate } from '@structure/source/common/forms/InputDate';
import { InputTimeRange } from '@structure/source/common/forms/InputTimeRange';
import { Calendar } from '@structure/source/common/time/Calendar';
import { Table } from '@structure/source/common/tables/Table';
import { Tip } from '@structure/source/common/popovers/Tip';
import ChevronsUpDownIcon from '@structure/assets/icons/interface/ChevronsUpDownIcon.svg';
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';
import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';

// Component - StructurePage
export interface StructurePageInterface {}
export function StructurePage(properties: StructurePageInterface) {
    const countries = [
        { content: 'Afghanistan', value: 'AF' },
        { content: 'Åland Islands', value: 'AX' },
        { content: 'Albania', value: 'AL' },
        { content: 'Algeria', value: 'DZ' },
        { content: 'American Samoa', value: 'AS' },
        { content: 'AndorrA', value: 'AD' },
        { content: 'Angola', value: 'AO' },
        { content: 'Anguilla', value: 'AI' },
        { content: 'Antarctica', value: 'AQ' },
        { content: 'Antigua and Barbuda', value: 'AG' },
        { content: 'Argentina', value: 'AR' },
        { content: 'Armenia', value: 'AM' },
        { content: 'Aruba', value: 'AW' },
        { content: 'Australia', value: 'AU' },
        { content: 'Austria', value: 'AT' },
        { content: 'Azerbaijan', value: 'AZ' },
        { content: 'Bahamas', value: 'BS' },
        { content: 'Bahrain', value: 'BH' },
        { content: 'Bangladesh', value: 'BD' },
        { content: 'Barbados', value: 'BB' },
        { content: 'Belarus', value: 'BY' },
        { content: 'Belgium', value: 'BE' },
        { content: 'Belize', value: 'BZ' },
        { content: 'Benin', value: 'BJ' },
        { content: 'Bermuda', value: 'BM' },
        { content: 'Bhutan', value: 'BT' },
        { content: 'Bolivia', value: 'BO' },
        { content: 'Bosnia and Herzegovina', value: 'BA' },
        { content: 'Botswana', value: 'BW' },
        { content: 'Bouvet Island', value: 'BV' },
        { content: 'Brazil', value: 'BR' },
        { content: 'British Indian Ocean Territory', value: 'IO' },
        { content: 'Brunei Darussalam', value: 'BN' },
        { content: 'Bulgaria', value: 'BG' },
        { content: 'Burkina Faso', value: 'BF' },
        { content: 'Burundi', value: 'BI' },
        { content: 'Cambodia', value: 'KH' },
        { content: 'Cameroon', value: 'CM' },
        { content: 'Canada', value: 'CA' },
        { content: 'Cape Verde', value: 'CV' },
        { content: 'Cayman Islands', value: 'KY' },
        { content: 'Central African Republic', value: 'CF' },
        { content: 'Chad', value: 'TD' },
        { content: 'Chile', value: 'CL' },
        { content: 'China', value: 'CN' },
        { content: 'Christmas Island', value: 'CX' },
        { content: 'Cocos (Keeling) Islands', value: 'CC' },
        { content: 'Colombia', value: 'CO' },
        { content: 'Comoros', value: 'KM' },
        { content: 'Congo', value: 'CG' },
        { content: 'Congo, The Democratic Republic of the', value: 'CD' },
        { content: 'Cook Islands', value: 'CK' },
        { content: 'Costa Rica', value: 'CR' },
        { content: "Cote D'Ivoire", value: 'CI' },
        { content: 'Croatia', value: 'HR' },
        { content: 'Cuba', value: 'CU' },
        { content: 'Cyprus', value: 'CY' },
        { content: 'Czech Republic', value: 'CZ' },
        { content: 'Denmark', value: 'DK' },
        { content: 'Djibouti', value: 'DJ' },
        { content: 'Dominica', value: 'DM' },
        { content: 'Dominican Republic', value: 'DO' },
        { content: 'Ecuador', value: 'EC' },
        { content: 'Egypt', value: 'EG' },
        { content: 'El Salvador', value: 'SV' },
        { content: 'Equatorial Guinea', value: 'GQ' },
        { content: 'Eritrea', value: 'ER' },
        { content: 'Estonia', value: 'EE' },
        { content: 'Ethiopia', value: 'ET' },
        { content: 'Falkland Islands (Malvinas)', value: 'FK' },
        { content: 'Faroe Islands', value: 'FO' },
        { content: 'Fiji', value: 'FJ' },
        { content: 'Finland', value: 'FI' },
        { content: 'France', value: 'FR' },
        { content: 'French Guiana', value: 'GF' },
        { content: 'French Polynesia', value: 'PF' },
        { content: 'French Southern Territories', value: 'TF' },
        { content: 'Gabon', value: 'GA' },
        { content: 'Gambia', value: 'GM' },
        { content: 'Georgia', value: 'GE' },
        { content: 'Germany', value: 'DE' },
        { content: 'Ghana', value: 'GH' },
        { content: 'Gibraltar', value: 'GI' },
        { content: 'Greece', value: 'GR' },
        { content: 'Greenland', value: 'GL' },
        { content: 'Grenada', value: 'GD' },
        { content: 'Guadeloupe', value: 'GP' },
        { content: 'Guam', value: 'GU' },
        { content: 'Guatemala', value: 'GT' },
        { content: 'Guernsey', value: 'GG' },
        { content: 'Guinea', value: 'GN' },
        { content: 'Guinea-Bissau', value: 'GW' },
        { content: 'Guyana', value: 'GY' },
        { content: 'Haiti', value: 'HT' },
        { content: 'Heard Island and Mcdonald Islands', value: 'HM' },
        { content: 'Holy See (Vatican City State)', value: 'VA' },
        { content: 'Honduras', value: 'HN' },
        { content: 'Hong Kong', value: 'HK' },
        { content: 'Hungary', value: 'HU' },
        { content: 'Iceland', value: 'IS' },
        { content: 'India', value: 'IN' },
        { content: 'Indonesia', value: 'ID' },
        { content: 'Iran, Islamic Republic Of', value: 'IR' },
        { content: 'Iraq', value: 'IQ' },
        { content: 'Ireland', value: 'IE' },
        { content: 'Isle of Man', value: 'IM' },
        { content: 'Israel', value: 'IL' },
        { content: 'Italy', value: 'IT' },
        { content: 'Jamaica', value: 'JM' },
        { content: 'Japan', value: 'JP' },
        { content: 'Jersey', value: 'JE' },
        { content: 'Jordan', value: 'JO' },
        { content: 'Kazakhstan', value: 'KZ' },
        { content: 'Kenya', value: 'KE' },
        { content: 'Kiribati', value: 'KI' },
        { content: "Korea, Democratic People'S Republic of", value: 'KP' },
        { content: 'Korea, Republic of', value: 'KR' },
        { content: 'Kuwait', value: 'KW' },
        { content: 'Kyrgyzstan', value: 'KG' },
        { content: "Lao People'S Democratic Republic", value: 'LA' },
        { content: 'Latvia', value: 'LV' },
        { content: 'Lebanon', value: 'LB' },
        { content: 'Lesotho', value: 'LS' },
        { content: 'Liberia', value: 'LR' },
        { content: 'Libyan Arab Jamahiriya', value: 'LY' },
        { content: 'Liechtenstein', value: 'LI' },
        { content: 'Lithuania', value: 'LT' },
        { content: 'Luxembourg', value: 'LU' },
        { content: 'Macao', value: 'MO' },
        { content: 'Macedonia, The Former Yugoslav Republic of', value: 'MK' },
        { content: 'Madagascar', value: 'MG' },
        { content: 'Malawi', value: 'MW' },
        { content: 'Malaysia', value: 'MY' },
        { content: 'Maldives', value: 'MV' },
        { content: 'Mali', value: 'ML' },
        { content: 'Malta', value: 'MT' },
        { content: 'Marshall Islands', value: 'MH' },
        { content: 'Martinique', value: 'MQ' },
        { content: 'Mauritania', value: 'MR' },
        { content: 'Mauritius', value: 'MU' },
        { content: 'Mayotte', value: 'YT' },
        { content: 'Mexico', value: 'MX' },
        { content: 'Micronesia, Federated States of', value: 'FM' },
        { content: 'Moldova, Republic of', value: 'MD' },
        { content: 'Monaco', value: 'MC' },
        { content: 'Mongolia', value: 'MN' },
        { content: 'Montserrat', value: 'MS' },
        { content: 'Morocco', value: 'MA' },
        { content: 'Mozambique', value: 'MZ' },
        { content: 'Myanmar', value: 'MM' },
        { content: 'Namibia', value: 'NA' },
        { content: 'Nauru', value: 'NR' },
        { content: 'Nepal', value: 'NP' },
        { content: 'Netherlands', value: 'NL' },
        { content: 'Netherlands Antilles', value: 'AN' },
        { content: 'New Caledonia', value: 'NC' },
        { content: 'New Zealand', value: 'NZ' },
        { content: 'Nicaragua', value: 'NI' },
        { content: 'Niger', value: 'NE' },
        { content: 'Nigeria', value: 'NG' },
        { content: 'Niue', value: 'NU' },
        { content: 'Norfolk Island', value: 'NF' },
        { content: 'Northern Mariana Islands', value: 'MP' },
        { content: 'Norway', value: 'NO' },
        { content: 'Oman', value: 'OM' },
        { content: 'Pakistan', value: 'PK' },
        { content: 'Palau', value: 'PW' },
        { content: 'Palestinian Territory, Occupied', value: 'PS' },
        { content: 'Panama', value: 'PA' },
        { content: 'Papua New Guinea', value: 'PG' },
        { content: 'Paraguay', value: 'PY' },
        { content: 'Peru', value: 'PE' },
        { content: 'Philippines', value: 'PH' },
        { content: 'Pitcairn', value: 'PN' },
        { content: 'Poland', value: 'PL' },
        { content: 'Portugal', value: 'PT' },
        { content: 'Puerto Rico', value: 'PR' },
        { content: 'Qatar', value: 'QA' },
        { content: 'Reunion', value: 'RE' },
        { content: 'Romania', value: 'RO' },
        { content: 'Russian Federation', value: 'RU' },
        { content: 'RWANDA', value: 'RW' },
        { content: 'Saint Helena', value: 'SH' },
        { content: 'Saint Kitts and Nevis', value: 'KN' },
        { content: 'Saint Lucia', value: 'LC' },
        { content: 'Saint Pierre and Miquelon', value: 'PM' },
        { content: 'Saint Vincent and the Grenadines', value: 'VC' },
        { content: 'Samoa', value: 'WS' },
        { content: 'San Marino', value: 'SM' },
        { content: 'Sao Tome and Principe', value: 'ST' },
        { content: 'Saudi Arabia', value: 'SA' },
        { content: 'Senegal', value: 'SN' },
        { content: 'Serbia and Montenegro', value: 'CS' },
        { content: 'Seychelles', value: 'SC' },
        { content: 'Sierra Leone', value: 'SL' },
        { content: 'Singapore', value: 'SG' },
        { content: 'Slovakia', value: 'SK' },
        { content: 'Slovenia', value: 'SI' },
        { content: 'Solomon Islands', value: 'SB' },
        { content: 'Somalia', value: 'SO' },
        { content: 'South Africa', value: 'ZA' },
        { content: 'South Georgia and the South Sandwich Islands', value: 'GS' },
        { content: 'Spain', value: 'ES' },
        { content: 'Sri Lanka', value: 'LK' },
        { content: 'Sudan', value: 'SD' },
        { content: 'Suriname', value: 'SR' },
        { content: 'Svalbard and Jan Mayen', value: 'SJ' },
        { content: 'Swaziland', value: 'SZ' },
        { content: 'Sweden', value: 'SE' },
        { content: 'Switzerland', value: 'CH' },
        { content: 'Syrian Arab Republic', value: 'SY' },
        { content: 'Taiwan, Province of China', value: 'TW' },
        { content: 'Tajikistan', value: 'TJ' },
        { content: 'Tanzania, United Republic of', value: 'TZ' },
        { content: 'Thailand', value: 'TH' },
        { content: 'Timor-Leste', value: 'TL' },
        { content: 'Togo', value: 'TG' },
        { content: 'Tokelau', value: 'TK' },
        { content: 'Tonga', value: 'TO' },
        { content: 'Trinidad and Tobago', value: 'TT' },
        { content: 'Tunisia', value: 'TN' },
        { content: 'Turkey', value: 'TR' },
        { content: 'Turkmenistan', value: 'TM' },
        { content: 'Turks and Caicos Islands', value: 'TC' },
        { content: 'Tuvalu', value: 'TV' },
        { content: 'Uganda', value: 'UG' },
        { content: 'Ukraine', value: 'UA' },
        { content: 'United Arab Emirates', value: 'AE' },
        { content: 'United Kingdom', value: 'GB' },
        { content: 'United States', value: 'US' },
        { content: 'United States Minor Outlying Islands', value: 'UM' },
        { content: 'Uruguay', value: 'UY' },
        { content: 'Uzbekistan', value: 'UZ' },
        { content: 'Vanuatu', value: 'VU' },
        { content: 'Venezuela', value: 'VE' },
        { content: 'Viet Nam', value: 'VN' },
        { content: 'Virgin Islands, British', value: 'VG' },
        { content: 'Virgin Islands, U.S.', value: 'VI' },
        { content: 'Wallis and Futuna', value: 'WF' },
        { content: 'Western Sahara', value: 'EH' },
        { content: 'Yemen', value: 'YE' },
        { content: 'Zambia', value: 'ZM' },
        { content: 'Zimbabwe', value: 'ZW' },
    ];

    const fruits = [
        // { content: 'Next.js', iconPosition: 'right' },
        // { content: 'SvelteKit', iconPosition: 'right' },
        // { content: 'Nuxt.js', iconPosition: 'right' },
        // { content: 'Remix', icon: CheckIcon, iconPosition: 'right' },
        // { content: 'Astro', iconPosition: 'right' },
        { content: 'Apple', value: 'Apple' },
        { content: 'Orange', value: 'Orange' },
        { content: 'Banana', value: 'Banana' },
        { content: 'Grapes', disabled: true, value: 'Grapes' },
        { content: 'Strawberry', value: 'Strawberry' },
        { content: 'Pineapple', value: 'Pineapple' },
        { content: 'Mango', value: 'Mango' },
        { content: 'Cherry', value: 'Cherry' },
        { content: 'Peach', value: 'Peach' },
        { content: 'Pear', value: 'Pear' },
        { content: 'Watermelon', value: 'Watermelon' },
        { content: 'Kiwi', value: 'Kiwi' },
        { content: 'Blueberry', value: 'Blueberry' },
        { content: 'Raspberry', value: 'Raspberry' },
        { content: 'Blackberry', value: 'Blackberry' },
        { content: 'Papaya', value: 'Papaya' },
        { content: 'Plum', value: 'Plum' },
        { content: 'Lemon', value: 'Lemon' },
        { content: 'Lime', value: 'Lime' },
        { content: 'Pomegranate', value: 'Pomegranate' },
    ];

    // Render the component
    return (
        <>
            <div className="absolute right-4 top-4 z-20">{<AccountMenuButton />}</div>

            <div className="mx-auto mt-10 max-w-[1024px] px-8">
                {/* Header */}
                <h1 className="mb-10">Interface</h1>

                {/* Loop 10 times and create 10 divs with the number in the div */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (number) {
                    // Convert the number to colors using HSL, rainbow style
                    const hue = (number - 1) * (360 / 10); // Adjust the hue to cover the rainbow spectrum
                    const color = `hsl(${hue}, 100%, 50%)`;

                    return (
                        <div
                            key={number}
                            className="mb-2 rounded-md border p-3 text-xl"
                            style={{
                                borderColor: color,
                            }}
                        >
                            {number}
                        </div>
                    );
                })}

                {/* <InputCheckbox defaultValue={InputCheckboxState.Indeterminate} /> */}

                {/* <Table
                    columns={[]}
                    rows={[]}
                    rowSelection={true}
                    columnVisibility={true}
                    // defaultVisibleColumnsIdentifiers={['column1']}
                    search={true}
                    // loading={true}
                    sortable={true}
                    pagination={{
                        itemsTotal: 4,
                        pagesTotal: 1,
                        onChange: async function (itemsPerPage, page) {
                            console.log('itemsPerPage', itemsPerPage);
                            console.log('page', page);
                        },
                    }}
                /> */}

                {/* <Table
                    columns={[
                        {
                            title: 'ID',
                            identifier: 'column1',
                            type: 'id',
                            description: 'ID is the unique identifier for the record.',
                        },
                        {
                            title: 'Status',
                            identifier: 'column2',
                            type: 'option',
                            possibleValues: [
                                { value: 'image', title: 'Image', hexColor: '#00AAFF' },
                                { value: 'video', title: 'Video', hexColor: '#AA00FF' },
                                { value: 'file', title: 'File', hexColor: '#FF00AA' },
                            ],
                        },
                        { title: 'Image URL', identifier: 'column3', type: 'imageUrl' },
                        { title: 'Created At', identifier: 'column4', type: 'dateTime' },
                    ]}
                    rows={[
                        {
                            cells: [
                                { value: '17c4858f-d160-4261-93f8-38197a494591' },
                                { value: 'Image' },
                                {
                                    value: '',
                                },
                                { value: '2023-08-31T13:07:17.000Z' },
                            ],
                        },
                        {
                            selected: true,
                            cells: [
                                { value: 'f18dd570-bdf5-40d6-9900-dfd5378eb672' },
                                { value: 'Video' },
                                { value: '' },
                                { value: '2023-08-31T13:07:17.000Z' },
                            ],
                        },
                        {
                            selected: true,
                            cells: [
                                { value: '01e72373-137a-4610-a01d-81f7373c4628' },
                                { value: 'File' },
                                { value: '' },
                                { value: '2023-08-31T13:07:17.000Z' },
                            ],
                        },
                        {
                            cells: [
                                { value: '0e947347-5b48-49a9-9fca-dc92b6187894' },
                                { value: 'Image' },
                                { value: '' },
                                { value: '2023-08-31T13:07:17.000Z' },
                            ],
                        },
                    ]}
                    rowSelection={true}
                    columnVisibility={true}
                    // defaultVisibleColumnsIdentifiers={['column1']}
                    search={true}
                    sortable={true}
                    pagination={{
                        itemsTotal: 4,
                        pagesTotal: 1,
                        onChange: async function (itemsPerPage, page) {
                            console.log('itemsPerPage', itemsPerPage);
                            console.log('page', page);
                        },
                    }}
                /> */}

                {/* <FormInputDate
                    label="Birth Date"
                    labelTip="Tell us when to say happy birthday!"
                    description="It's your birthday, shout hurray!"
                    id="date"
                /> */}

                {/* <InputDate /> */}

                {/* <InputTimeRange showTimeRangePresets /> */}

                {/* <Calendar /> */}

                {/* <DatePickerWithRange
                date={{
                    from: new Date(dateRange?.from ?? ''),
                    to: dateRange.to ? new Date(dateRange?.to) : new Date(dateRange?.from ?? ''),
                }}
                setDate={(date) => setDateRange(date ?? null)}
                /> */}

                {/* <DatabaseAndTableFormInputSelects /> */}

                {/* <Form
                    description={<p className="font-medium">Select a Country</p>}
                    onSubmit={async function (formValues) {
                        console.log('formValues', formValues);

                        return {
                            success: true,
                            message: 'formVales: ' + JSON.stringify(formValues),
                        };
                    }}
                    resetOnSubmitSuccess={true}
                    formInputs={[
                        <FormInputText
                            id="firstName"
                            key="firstName"
                            label="First Name"
                            labelTip="Enter your first name."
                            description="Enter your first name."
                            className=""
                            // defaultValue={'John'}
                            // required={true}
                        />,
                        <FormInputSelect
                            id="fruit"
                            key="fruit"
                            label="Fruit"
                            labelTip="Select a fruit."
                            description="Select a fruit."
                            className=""
                            // defaultValue={'Cherry'}
                            items={fruits}
                            // search={true}
                            required={true}
                            placeholder="Select a Fruit..."
                        />,
                        <FormInputSelect
                            id="country"
                            key="country"
                            label="Country"
                            labelTip="Select a country."
                            description="Select a country."
                            className=""
                            defaultValue={'PR'}
                            items={countries}
                            search={true}
                            required={true}
                            placeholder="Select a Country..."
                        />,
                        <FormInputCheckbox
                            id="terms"
                            key="terms"
                            label="I agree to the terms and conditions."
                            labelTip="This is a tip for the terms and conditions."
                            description="You must agree to the terms and conditions."
                            className=""
                            required={true}
                        />,
                    ]}
                /> */}

                {/* <InputSelect
                    className=""
                    items={[
                        {
                            value: 'northAmerica',
                            content: 'North America',
                        },
                        {
                            value: 'southAmerica',
                            content: 'South America',
                        },
                        {
                            value: 'europe',
                            content: 'Europe',
                        },
                        {
                            value: 'asia',
                            content: 'Asia',
                        },
                        {
                            value: 'africa',
                            content: 'Africa',
                        },
                        {
                            value: 'australia',
                            content: 'Australia',
                        },
                        {
                            value: 'antarctica',
                            content: 'Antarctica',
                        },
                    ]}
                    placeholder="Select a Country..."
                    // allowNoSelection
                /> */}

                {/* <InputMultipleSelect
                    className="mt-10"
                    items={[
                        {
                            value: 'northAmerica',
                            content: 'North America',
                        },
                        {
                            value: 'southAmerica',
                            content: 'South America',
                        },
                        {
                            value: 'europe',
                            content: 'Europe',
                        },
                        {
                            value: 'asia',
                            content: 'Asia',
                        },
                        {
                            value: 'africa',
                            content: 'Africa',
                        },
                        {
                            value: 'australia',
                            content: 'Australia',
                        },
                        {
                            value: 'antarctica',
                            content: 'Antarctica',
                        },
                    ]}
                    placeholder="Select a Country..."
                /> */}

                {/* <div className="mb-10 flex flex-col space-y-4">
                    <Button variant="menuItem" size="menuItem" className="border" icon={CheckIcon} iconPosition="left">
                        Button 1
                    </Button>
                    <Button variant="menuItem" size="menuItem" className="border" icon={CheckIcon} iconPosition="right">
                        Button 2
                    </Button>
                    <Button variant="menuItem" size="menuItem" className="border" icon={CheckIcon} iconPosition="right">
                        Button 3
                    </Button>
                </div> */}

                {/* <InputSelect
                    className="w-[200px]"
                    loadItems={async function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve(fruits);
                            }, 1000);
                        });
                    }}
                    loadingItemsMessage="Finding fruits!"
                    search={true}
                /> */}

                {/* <PopoverMenu
                    className="w-[200px]"
                    loadItems={async function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve(fruits);
                            }, 1000);
                        });
                    }}
                    search={true}
                >
                    <Button className="mb-10 w-[200px]" variant="formInputSelect" size="formInputSelect">
                        Select fruit...
                    </Button>
                </PopoverMenu> */}

                {/* <Menu
                    title="Fruits"
                    className="max-h-[400px] max-w-[214px] overflow-scroll"
                    // menuItems={fruits}
                    search={true}
                    loadingItemsMessage="Finding fruits!"
                    loadItems={async function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve(fruits);
                            }, 1000);
                        });
                    }}
                    // Simulate a loading error
                    // loadItems={async function () {
                    //     return new Promise(function (resolve, reject) {
                    //         setTimeout(function () {
                    //             reject(new Error('Error Loading Items'));
                    //         }, 1000);
                    //     });
                    // }}
                /> */}
            </div>
        </>
    );
}

// Export - Default
export default StructurePage;
