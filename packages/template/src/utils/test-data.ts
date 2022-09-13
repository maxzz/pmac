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
                        "id": "l7zx3p83",
                        "idx": 0,
                        "urls": [
                            {
                                "domain": "aarp.org",
                                "ourl": "https://banksafetraining.aarp.org/FinancialInstitution/Login?code=BAC_COMMUNITY_BANK%23BAC_COMMUNITY_BANK",
                                "murl": "https://banksafetraining.aarp.org/FinancialInstitution/Login?code=BAC_COMMUNITY_BANK%23BAC_COMMUNITY_BANK"
                            },
                            {}
                        ],
                        "title": "AARP BankSafe Training - First-Time User",
                        "short": "aapr.org{28ffdef1-210e-4c78-b77e-a87a80b4bfbb}.dpm"
                    },
                    {
                        "id": "l7zx3p86",
                        "idx": 1,
                        "urls": [
                            {
                                "domain": "aarp.org",
                                "ourl": "https://banksafetraining.aarp.org/Account/Login?ReturnUrl=%2F",
                                "murl": "https://banksafetraining.aarp.org/Account/Login?ReturnUrl=%2F"
                            },
                            {}
                        ],
                        "title": "AARP BankSafe Training",
                        "short": "aapr.org{c06ec934-4be0-4785-8540-d3e985aeadd5}.dpm"
                    },
                    {
                        "id": "l7zx3p88",
                        "idx": 2,
                        "urls": [
                            {
                                "domain": "fiserv.com",
                                "ourl": "https://onboardadvisor.fiserv.com/",
                                "murl": "https://onboardadvisor.fiserv.com/"
                            },
                            {}
                        ],
                        "title": "Fiserv - Onboard Adviser",
                        "short": "fiserv.com.{6d268ceb-01d5-4b29-a38b-5771eca42568}.dpm"
                    },
                    {
                        "id": "l7zx3p89",
                        "idx": 3,
                        "urls": [
                            {
                                "domain": "fiserv.com",
                                "ourl": "https://www.intelligentworkplace.app.fiserv.com/#/authentication/login/Login",
                                "murl": "https://www.intelligentworkplace.app.fiserv.com/#/authentication/login/Login"
                            },
                            {}
                        ],
                        "title": "Intelligent Workplace - Fiserv Vantage",
                        "short": "fiserv.com.{78d225a8-ab93-4375-9383-582f9a3f6b90}.dpm"
                    },
                    {
                        "id": "l7zx3p8a",
                        "idx": 4,
                        "urls": [
                            {
                                "domain": "fiserv.com",
                                "ourl": "https://www.intelligentworkplace.app.fiserv.com/#/authentication/login/Login",
                                "murl": "https://www.intelligentworkplace.app.fiserv.com/#/authentication/login/Login"
                            },
                            {}
                        ],
                        "title": "Intelligent Workplace",
                        "short": "fiserv.com.{7efa6dd7-be39-476a-bdee-a70929918662}.dpm"
                    },
                    {
                        "id": "l7zx3p8b",
                        "idx": 5,
                        "urls": [
                            {
                                "domain": "fiserv.com",
                                "ourl": "https://bankac.customsource.fiserv.com/Login.epm",
                                "murl": "https://bankac.customsource.fiserv.com/Login.epm"
                            },
                            {}
                        ],
                        "title": "Fiserv Source Advantage",
                        "short": "fiserv.com.{9667a3e4-6f7f-4a92-a09a-3c7a3c5f7f0c}.dpm"
                    },
                    {
                        "id": "l7zx3p8c",
                        "idx": 6,
                        "urls": [
                            {
                                "domain": "fiserv.com",
                                "ourl": "https://ipcws.fiserv.com/CWS.WEB/Login.aspx",
                                "murl": "https://ipcws.fiserv.com/CWS.WEB/Login.aspx"
                            },
                            {}
                        ],
                        "title": "TCM Return",
                        "short": "fiserv.com.{c330549b-bc7f-41db-91ea-14b8fe0eac0c}.dpm"
                    },
                    {
                        "id": "l7zx3p8d",
                        "idx": 7,
                        "urls": [
                            {
                                "domain": "fiserv.com",
                                "ourl": "https://www.bankintelligence.fiserv.com/main/bancAnalyst/login",
                                "murl": "https://www.bankintelligence.fiserv.com/main/bancAnalyst/login"
                            },
                            {}
                        ],
                        "title": "Fiserv BankAnalyst/Business Intelligence",
                        "short": "fiserv.com.{c857ed8e-5e08-48c2-ac5e-be1495b7b5a3}.dpm"
                    },
                    {
                        "id": "l7zx3p8e",
                        "idx": 8,
                        "urls": [
                            {
                                "domain": "onefiserv.com",
                                "ourl": "https://oa-mc-cert.onefiserv.com/",
                                "murl": "https://oa-mc-cert.onefiserv.com/"
                            },
                            {}
                        ],
                        "title": "Fiserv - Onboard Advisor - Training",
                        "short": "onefiserv.com.{5518a6d0-ee18-4e0b-89ae-be1e6effed62}.dpm"
                    },
                    {
                        "id": "l7zx3p8f",
                        "idx": 9,
                        "urls": [
                            {
                                "domain": "nextgencontrol.com",
                                "ourl": "https://app.nextgencontrol.com/Core/Authentication/Login?ReturnUrl=https%3A%2F%2Fapp.nextgencontrol.com%2FBRI%2FAlertManagement%3FswitchTo%3D7085",
                                "murl": "https://app.nextgencontrol.com/Core/Authentication/Login?ReturnUrl=https%3A%2F%2Fapp.nextgencontrol.com%2FBRI%2FAlertManagement%3FswitchTo%3D7085"
                            },
                            {}
                        ],
                        "title": "FIS Managed Risk and Security Services",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}.dpm"
                    },
                    {
                        "id": "l7zx3p8g",
                        "idx": 10,
                        "urls": [
                            {
                                "domain": "mimecast.com",
                                "ourl": "https://brighthorizons.login-us.mimecast.com/u/login/?gta=secure#/login",
                                "murl": "https://brighthorizons.login-us.mimecast.com/u/login/?gta=secure#/login"
                            },
                            {
                                "domain": "mimecast.com",
                                "ourl": "https://brighthorizons.login-us.mimecast.com/u/login/?gta=secure#/reset-password/",
                                "murl": "https://brighthorizons.login-us.mimecast.com/u/login/?gta=secure#/reset-password/"
                            }
                        ],
                        "title": "Bright Horizons Secure Message PW",
                        "short": "{0a60444f-1a89-4b1d-8a7f-c3b87c3b7f80}.dpm"
                    },
                    {
                        "id": "l7zx3p8h",
                        "idx": 11,
                        "urls": [
                            {},
                            {}
                        ],
                        "title": "BeyondTrust - ERPM",
                        "short": "{2de7d301-a9cb-4b81-8541-44d483f326fe}.dpm"
                    },
                    {
                        "id": "l7zx3p8j",
                        "idx": 12,
                        "urls": [
                            {
                                "domain": "arcot.com",
                                "ourl": "https://secure5a.arcot.com/arcotadmin/bamlogin.htm",
                                "murl": "https://secure5a.arcot.com/arcotadmin/bamlogin.htm"
                            },
                            {
                                "domain": "arcot.com",
                                "ourl": "https://secure5a.arcot.com/arcotadmin/bamlogin.htm",
                                "murl": "https://secure5a.arcot.com/arcotadmin/bamlogin.htm"
                            }
                        ],
                        "title": "3D Secure Signon Organization",
                        "short": "{2f8fd1e2-2db4-400e-943c-a1b8d13f9e09}.dpm"
                    }
                ]
            },
            "domcreds": {
                "multiple": [
                    {
                        "id": "l7zx3p83"
                    },
                    {
                        "id": "l7zx3p86"
                    },
                    {
                        "id": "l7zx3p88"
                    },
                    {
                        "id": "l7zx3p89"
                    },
                    {
                        "id": "l7zx3p8a"
                    },
                    {
                        "id": "l7zx3p8b"
                    },
                    {
                        "id": "l7zx3p8c"
                    },
                    {
                        "id": "l7zx3p8d"
                    }
                ]
            }
        },
        {
            "root": "c:/Y/w/2-web/0-dp/utils/pm-domain-credentials-switch/packages/utility/tests/02",
            "inputs": {
                "input": [
                    {
                        "id": "l7zx3p8u",
                        "idx": 0,
                        "urls": [
                            {
                                "domain": "nextgencontrol.com",
                                "ourl": "https://app.nextgencontrol.com/Core/Authentication/Login?ReturnUrl=https%3A%2F%2Fapp.nextgencontrol.com%2FBRI%2FAlertManagement%3FswitchTo%3D7085",
                                "murl": "https://app.nextgencontrol.com/Core/Authentication/Login?ReturnUrl=https%3A%2F%2Fapp.nextgencontrol.com%2FBRI%2FAlertManagement%3FswitchTo%3D7085"
                            },
                            {}
                        ],
                        "title": "FIS Managed Risk and Security Services",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}.dpm"
                    },
                    {
                        "id": "l7zx3p8v",
                        "idx": 1,
                        "urls": [
                            {
                                "domain": "nextgencontrol.com",
                                "ourl": "https://app.nextgencontrol.com/Core/Authentication/Login?ReturnUrl=https%3A%2F%2Fapp.nextgencontrol.com%2FBRI%2FAlertManagement%3FswitchTo%3D7085",
                                "murl": "https://app.nextgencontrol.com/Core/Authentication/Login?ReturnUrl=https%3A%2F%2Fapp.nextgencontrol.com%2FBRI%2FAlertManagement%3FswitchTo%3D7085"
                            },
                            {}
                        ],
                        "title": "FIS Managed Risk and Security Services",
                        "short": "{0a58d2be-9441-4860-ae5b-cb3cb09de112}_new.dpm"
                    },
                    {
                        "id": "l7zx3p8w",
                        "idx": 2,
                        "urls": [
                            {
                                "domain": "mimecast.com",
                                "ourl": "https://brighthorizons.login-us.mimecast.com/u/login/?gta=secure#/login",
                                "murl": "https://brighthorizons.login-us.mimecast.com/u/login/?gta=secure#/login"
                            },
                            {
                                "domain": "mimecast.com",
                                "ourl": "https://brighthorizons.login-us.mimecast.com/u/login/?gta=secure#/reset-password/",
                                "murl": "https://brighthorizons.login-us.mimecast.com/u/login/?gta=secure#/reset-password/"
                            }
                        ],
                        "title": "Bright Horizons Secure Message PW",
                        "short": "{0a60444f-1a89-4b1d-8a7f-c3b87c3b7f80}.dpm"
                    },
                    {
                        "id": "l7zx3p8x",
                        "idx": 3,
                        "urls": [
                            {},
                            {}
                        ],
                        "title": "BeyondTrust - ERPM",
                        "short": "{2de7d301-a9cb-4b81-8541-44d483f326fe}.dpm"
                    },
                    {
                        "id": "l7zx3p8z",
                        "idx": 4,
                        "urls": [
                            {
                                "domain": "arcot.com",
                                "ourl": "https://secure5a.arcot.com/arcotadmin/bamlogin.htm",
                                "murl": "https://secure5a.arcot.com/arcotadmin/bamlogin.htm"
                            },
                            {
                                "domain": "arcot.com",
                                "ourl": "https://secure5a.arcot.com/arcotadmin/bamlogin.htm",
                                "murl": "https://secure5a.arcot.com/arcotadmin/bamlogin.htm"
                            }
                        ],
                        "title": "3D Secure Signon Organization",
                        "short": "{2f8fd1e2-2db4-400e-943c-a1b8d13f9e09}.dpm"
                    }
                ]
            },
            "domcreds": {
                "multiple": [
                    {
                        "id": "l7zx3p8u"
                    },
                    {
                        "id": "l7zx3p8v"
                    }
                ]
            }
        }
    ]
    ;

    (window as any)['tmReport'] = testReports;
}

export const reports: ReportRecords = (window as any)['tmReport'];
