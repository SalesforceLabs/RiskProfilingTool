public with sharing class ATR_ClientController {
    @AuraEnabled
    public static Account getClient(String clientId) {
        Account acct;
        List<string> fields = new List<string> { 'Id', 'Name' };
        
        boolean isAccessible = ATR_FLSCheck.checkFLS(Account.sObjectType.getDescribe(), fields, 'Read');
        if (isAccessible) {
            acct = [ SELECT Id, Name FROM Account WHERE Id = :clientId ];
        }
        return acct;
    }

    @AuraEnabled
    public static List<ATR_Template__c> getTemplates() {
        List<ATR_Template__c> templates = new List<ATR_Template__c>();
        List<string> fields = new List<string> { 'Id', 'Name' };
        
        boolean isAccessible = ATR_FLSCheck.checkFLS(ATR_Template__c.sObjectType.getDescribe(), fields, 'Read');
        if (isAccessible) {
            templates = [ SELECT Id, Name FROM ATR_Template__c ORDER BY Name ];
        }
        return templates;
    }

	@AuraEnabled
    public static Risk_Profile__c getRiskProfile(String score) {
        List<string> fields = new List<string> { 
            'Id', 
            'Name',
            'LowScore__c', 
            'HighScore__c', 
            'Description__c'
        };
        
        boolean isAccessible = ATR_FLSCheck.checkFLS(Risk_Profile__c.sObjectType.getDescribe(), fields, 'Read');
        if (isAccessible) {
            List<Risk_Profile__c> riskProfiles = [ SELECT Id, Name, LowScore__c, HighScore__c, Description__c
                                                            FROM Risk_Profile__c ];
    
            for(Risk_Profile__c riskProfile : riskProfiles) {
                Decimal low  = riskProfile.lowScore__c;
                Decimal high = riskProfile.highScore__c;
                Decimal totalScore = Decimal.valueOf(score);
    
                if (totalScore >= low && totalScore <= high) {
                    return riskProfile;
                }
            }
        }
        return null;
    }
    
    @auraEnabled
    public static ATR_Taken__c updateATR(ATR_Taken__c atr, String riskProfileId) {        
        // ATR should have been created in this stage
        if (atr != null) {
            Boolean isUpdateable = ATR_FLSCheck.checkObjectSecurity(ATR_Taken__c.sObjectType.getDescribe(), 'Update');
            if (isUpdateable) {
                atr.Risk_Profile__c = riskProfileId;
            	update atr;
            }
            return atr;
        }
        return null;
    }
}