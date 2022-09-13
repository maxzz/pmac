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
                        "id": "l7zkqhz4",
                        "idx": 0,
                        "title": "AARP BankSafe Training - First-Time User",
                        "short": "aapr.org{28ffdef1-210e-4c78-b77e-a87a80b4bfbb}.dpm"
                    },
                    {
                        "id": "l7zkqhz6",
                        "idx": 1,
                        "title": "AARP BankSafe Training",
                        "short": "aapr.org{c06ec934-4be0-4785-8540-d3e985aeadd5}.dpm"
                    },
                    {
                        "id": "l7zkqhz8",
                        "idx": 2,
                        "title": "Fiserv - Onboard Adviser",
                        "short": "fiserv.com.{6d268ceb-01d5-4b29-a38b-5771eca42568}.dpm"
                    },
                    {
                        "id": "l7zkqhz9",
                        "idx": 3,
                        "title": "Intelligent Workplace - Fiserv Vantage",
                        "short": "fiserv.com.{78d225a8-ab93-4375-9383-582f9a3f6b90}.dpm"
                    },
                    {
                        "id": "l7zkqhza",
                        "idx": 4,
                        "title": "Intelligent Workplace",
                        "short": "fiserv.com.{7efa6dd7-be39-476a-bdee-a70929918662}.dpm"
                    },
                    {
                        "id": "l7zkqhzc",
                        "idx": 5,
                        "title": "Fiserv Source Advantage",
                        "short": "fiserv.com.{9667a3e4-6f7f-4a92-a09a-3c7a3c5f7f0c}.dpm"
                    },
                    {
                        "id": "l7zkqhze",
                        "idx": 6,
                        "title": "TCM Return",
                        "short": "fiserv.com.{c330549b-bc7f-41db-91ea-14b8fe0eac0c}.dpm"
                    },
                    {
                        "id": "l7zkqhzf",
                        "idx": 7,
                        "title": "Fiserv BankAnalyst/Business Intelligence",
                        "short": "fiserv.com.{c857ed8e-5e08-48c2-ac5e-be1495b7b5a3}.dpm"
                    },
                    {
                        "id": "l7zkqhzg",
                        "idx": 8,
                        "title": "Fiserv - Onboard Advisor - Training",
                        "short": "onefiserv.com.{5518a6d0-ee18-4e0b-89ae-be1e6effed62}.dpm"
                    },
                    {
                        "id": "l7zkqhzh",
                        "idx": 9,
                        "title": "FIS Managed Risk and Security Services",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}.dpm"
                    },
                    {
                        "id": "l7zkqhzi",
                        "idx": 10,
                        "title": "Bright Horizons Secure Message PW",
                        "short": "{0a60444f-1a89-4b1d-8a7f-c3b87c3b7f80}.dpm"
                    },
                    {
                        "id": "l7zkqhzk",
                        "idx": 11,
                        "title": "BeyondTrust - ERPM",
                        "short": "{2de7d301-a9cb-4b81-8541-44d483f326fe}.dpm"
                    },
                    {
                        "id": "l7zkqhzm",
                        "idx": 12,
                        "title": "3D Secure Signon Organization",
                        "short": "{2f8fd1e2-2db4-400e-943c-a1b8d13f9e09}.dpm"
                    }
                ]
            },
            "domcreds": {
                "multiple": [
                    {
                        "id": "l7zkqhz4"
                    },
                    {
                        "id": "l7zkqhz6"
                    },
                    {
                        "id": "l7zkqhz8"
                    },
                    {
                        "id": "l7zkqhz9"
                    },
                    {
                        "id": "l7zkqhza"
                    },
                    {
                        "id": "l7zkqhzc"
                    },
                    {
                        "id": "l7zkqhze"
                    },
                    {
                        "id": "l7zkqhzf"
                    }
                ]
            }
        },
        {
            "root": "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/02",
            "inputs": {
                "input": [
                    {
                        "id": "l7zkqhzy",
                        "idx": 0,
                        "title": "FIS Managed Risk and Security Services",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}.dpm"
                    },
                    {
                        "id": "l7zkqhzz",
                        "idx": 1,
                        "title": "FIS Managed Risk and Security Services",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}_new.dpm"
                    },
                    {
                        "id": "l7zkqi00",
                        "idx": 2,
                        "title": "Bright Horizons Secure Message PW",
                        "short": "{0a60444f-1a89-4b1d-8a7f-c3b87c3b7f80}.dpm"
                    },
                    {
                        "id": "l7zkqi01",
                        "idx": 3,
                        "title": "BeyondTrust - ERPM",
                        "short": "{2de7d301-a9cb-4b81-8541-44d483f326fe}.dpm"
                    },
                    {
                        "id": "l7zkqi03",
                        "idx": 4,
                        "title": "3D Secure Signon Organization",
                        "short": "{2f8fd1e2-2db4-400e-943c-a1b8d13f9e09}.dpm"
                    }
                ]
            },
            "domcreds": {
                "multiple": [
                    {
                        "id": "l7zkqhzy"
                    },
                    {
                        "id": "l7zkqhzz"
                    }
                ]
            }
        }
    ]
    ;

    (window as any)['tmReport'] = testReports;
}

export const reports: ReportRecords = (window as any)['tmReport'];
