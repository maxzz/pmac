import { ReportRecords } from '@pmac/shared-types';

if (process.env.NODE_ENV !== 'production') {
    console.log('only dev');

    const report: ReportRecords = 
    {
        "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/01": {
            "inputs": {
                "input": [
                    {
                        "title": "AARP BankSafe Training - First-Time User",
                        "short": "aapr.org{28ffdef1-210e-4c78-b77e-a87a80b4bfbb}.dpm"
                    },
                    {
                        "title": "AARP BankSafe Training",
                        "short": "aapr.org{c06ec934-4be0-4785-8540-d3e985aeadd5}.dpm"
                    },
                    {
                        "title": "Fiserv - Onboard Adviser",
                        "short": "fiserv.com.{6d268ceb-01d5-4b29-a38b-5771eca42568}.dpm"
                    },
                    {
                        "title": "Intelligent Workplace - Fiserv Vantage",
                        "short": "fiserv.com.{78d225a8-ab93-4375-9383-582f9a3f6b90}.dpm"
                    },
                    {
                        "title": "Intelligent Workplace",
                        "short": "fiserv.com.{7efa6dd7-be39-476a-bdee-a70929918662}.dpm"
                    },
                    {
                        "title": "Fiserv Source Advantage",
                        "short": "fiserv.com.{9667a3e4-6f7f-4a92-a09a-3c7a3c5f7f0c}.dpm"
                    },
                    {
                        "title": "TCM Return",
                        "short": "fiserv.com.{c330549b-bc7f-41db-91ea-14b8fe0eac0c}.dpm"
                    },
                    {
                        "title": "Fiserv BankAnalyst/Business Intelligence",
                        "short": "fiserv.com.{c857ed8e-5e08-48c2-ac5e-be1495b7b5a3}.dpm"
                    },
                    {
                        "title": "Fiserv - Onboard Advisor - Training",
                        "short": "onefiserv.com.{5518a6d0-ee18-4e0b-89ae-be1e6effed62}.dpm"
                    },
                    {
                        "title": "FIS Managed Risk and Security Services",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}.dpm"
                    },
                    {
                        "title": "Bright Horizons Secure Message PW",
                        "short": "{0a60444f-1a89-4b1d-8a7f-c3b87c3b7f80}.dpm"
                    },
                    {
                        "title": "BeyondTrust - ERPM",
                        "short": "{2de7d301-a9cb-4b81-8541-44d483f326fe}.dpm"
                    },
                    {
                        "title": "3D Secure Signon Organization",
                        "short": "{2f8fd1e2-2db4-400e-943c-a1b8d13f9e09}.dpm"
                    }
                ]
            },
            "domcreds": {
                "multiple": [
                    {
                        "file": "aapr.org{28ffdef1-210e-4c78-b77e-a87a80b4bfbb}.dpm"
                    },
                    {
                        "file": "aapr.org{c06ec934-4be0-4785-8540-d3e985aeadd5}.dpm"
                    },
                    {
                        "file": "fiserv.com.{6d268ceb-01d5-4b29-a38b-5771eca42568}.dpm"
                    },
                    {
                        "file": "fiserv.com.{78d225a8-ab93-4375-9383-582f9a3f6b90}.dpm"
                    },
                    {
                        "file": "fiserv.com.{7efa6dd7-be39-476a-bdee-a70929918662}.dpm"
                    },
                    {
                        "file": "fiserv.com.{9667a3e4-6f7f-4a92-a09a-3c7a3c5f7f0c}.dpm"
                    },
                    {
                        "file": "fiserv.com.{c330549b-bc7f-41db-91ea-14b8fe0eac0c}.dpm"
                    },
                    {
                        "file": "fiserv.com.{c857ed8e-5e08-48c2-ac5e-be1495b7b5a3}.dpm"
                    }
                ]
            }
        }
    }
    ;

    (window as any)['tmReport'] = report;
}

export const report: ReportRecords = (window as any)['tmReport'];
