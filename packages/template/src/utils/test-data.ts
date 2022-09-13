import { ReportRecords } from '@pmac/shared-types';

if (process.env.NODE_ENV !== 'production') {
    console.log('only dev');

    const testReports: ReportRecords = 
    [
        {
            "root": "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/01",
            "inputs": {
                "input": [
                    {
                        "id": "l7zh2hgl",
                        "title": "AARP BankSafe Training - First-Time User",
                        "short": "aapr.org{28ffdef1-210e-4c78-b77e-a87a80b4bfbb}.dpm"
                    },
                    {
                        "id": "l7zh2hgm",
                        "title": "AARP BankSafe Training",
                        "short": "aapr.org{c06ec934-4be0-4785-8540-d3e985aeadd5}.dpm"
                    },
                    {
                        "id": "l7zh2hgn",
                        "title": "Fiserv - Onboard Adviser",
                        "short": "fiserv.com.{6d268ceb-01d5-4b29-a38b-5771eca42568}.dpm"
                    },
                    {
                        "id": "l7zh2hgo",
                        "title": "Intelligent Workplace - Fiserv Vantage",
                        "short": "fiserv.com.{78d225a8-ab93-4375-9383-582f9a3f6b90}.dpm"
                    },
                    {
                        "id": "l7zh2hgp",
                        "title": "Intelligent Workplace",
                        "short": "fiserv.com.{7efa6dd7-be39-476a-bdee-a70929918662}.dpm"
                    },
                    {
                        "id": "l7zh2hgq",
                        "title": "Fiserv Source Advantage",
                        "short": "fiserv.com.{9667a3e4-6f7f-4a92-a09a-3c7a3c5f7f0c}.dpm"
                    },
                    {
                        "id": "l7zh2hgr",
                        "title": "TCM Return",
                        "short": "fiserv.com.{c330549b-bc7f-41db-91ea-14b8fe0eac0c}.dpm"
                    },
                    {
                        "id": "l7zh2hgs",
                        "title": "Fiserv BankAnalyst/Business Intelligence",
                        "short": "fiserv.com.{c857ed8e-5e08-48c2-ac5e-be1495b7b5a3}.dpm"
                    },
                    {
                        "id": "l7zh2hgt",
                        "title": "Fiserv - Onboard Advisor - Training",
                        "short": "onefiserv.com.{5518a6d0-ee18-4e0b-89ae-be1e6effed62}.dpm"
                    },
                    {
                        "id": "l7zh2hgu",
                        "title": "FIS Managed Risk and Security Services",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}.dpm"
                    },
                    {
                        "id": "l7zh2hgv",
                        "title": "Bright Horizons Secure Message PW",
                        "short": "{0a60444f-1a89-4b1d-8a7f-c3b87c3b7f80}.dpm"
                    },
                    {
                        "id": "l7zh2hgw",
                        "title": "BeyondTrust - ERPM",
                        "short": "{2de7d301-a9cb-4b81-8541-44d483f326fe}.dpm"
                    },
                    {
                        "id": "l7zh2hgy",
                        "title": "3D Secure Signon Organization",
                        "short": "{2f8fd1e2-2db4-400e-943c-a1b8d13f9e09}.dpm"
                    }
                ]
            },
            "domcreds": {
                "multiple": [
                    {
                        "id": "l7zh2hgl"
                    },
                    {
                        "id": "l7zh2hgm"
                    },
                    {
                        "id": "l7zh2hgn"
                    },
                    {
                        "id": "l7zh2hgo"
                    },
                    {
                        "id": "l7zh2hgp"
                    },
                    {
                        "id": "l7zh2hgq"
                    },
                    {
                        "id": "l7zh2hgr"
                    },
                    {
                        "id": "l7zh2hgs"
                    }
                ]
            }
        },
        {
            "root": "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/02",
            "inputs": {
                "input": [
                    {
                        "id": "l7zh2hh5",
                        "title": "FIS Managed Risk and Security Services",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}.dpm"
                    },
                    {
                        "id": "l7zh2hh6",
                        "title": "FIS Managed Risk and Security Services",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}_new.dpm"
                    },
                    {
                        "id": "l7zh2hh7",
                        "title": "Bright Horizons Secure Message PW",
                        "short": "{0a60444f-1a89-4b1d-8a7f-c3b87c3b7f80}.dpm"
                    },
                    {
                        "id": "l7zh2hh8",
                        "title": "BeyondTrust - ERPM",
                        "short": "{2de7d301-a9cb-4b81-8541-44d483f326fe}.dpm"
                    },
                    {
                        "id": "l7zh2hha",
                        "title": "3D Secure Signon Organization",
                        "short": "{2f8fd1e2-2db4-400e-943c-a1b8d13f9e09}.dpm"
                    }
                ]
            },
            "domcreds": {
                "multiple": [
                    {
                        "id": "l7zh2hh5"
                    },
                    {
                        "id": "l7zh2hh6"
                    }
                ]
            }
        }
    ]
    ;

    (window as any)['tmReport'] = testReports;
}

export const reports: ReportRecords = (window as any)['tmReport'];
