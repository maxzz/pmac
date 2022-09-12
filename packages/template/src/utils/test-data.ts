import { ItemInputFile, ReportRecords, Report_InputFiles } from '@pmac/shared-types';

if (process.env.NODE_ENV !== 'production') {
    console.log('only dev');

    const report: ReportRecords = {
        'folder': { // TODO: real folder
            "inputs": {
                "input": [
                    {
                        "title": "AARP BankSafe Training - First-Time User",
                        "root": "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/01",
                        "short": "aapr.org{28ffdef1-210e-4c78-b77e-a87a80b4bfbb}.dpm"
                    },
                    {
                        "title": "AARP BankSafe Training",
                        "root": "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/01",
                        "short": "aapr.org{c06ec934-4be0-4785-8540-d3e985aeadd5}.dpm"
                    },
                    {
                        "title": "FIS Managed Risk and Security Services",
                        "root": "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/01",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}.dpm"
                    },
                    {
                        "title": "Bright Horizons Secure Message PW",
                        "root": "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/01",
                        "short": "{0a60444f-1a89-4b1d-8a7f-c3b87c3b7f80}.dpm"
                    },
                    {
                        "title": "BeyondTrust - ERPM",
                        "root": "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/01",
                        "short": "{2de7d301-a9cb-4b81-8541-44d483f326fe}.dpm"
                    },
                    {
                        "title": "3D Secure Signon Organization",
                        "root": "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/01",
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
                    }
                ]
            }
        }
    };

    (window as any)['tmReport'] = report;
}

export const report: ReportRecords = (window as any)['tmReport'];
