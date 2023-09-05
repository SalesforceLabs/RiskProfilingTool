@isTest
public class ATR_ClientControllerTest {
    
    @isTest
    static void getClientTest() {
        Account client = new Account(Name = 'Answer Foster');
        insert client;
        
        Account actual = ATR_ClientController.getClient(client.Id);
        System.assert(actual != null);
        System.assertEquals(client.Name, actual.Name);
        System.assertEquals(client.Id, actual.Id);
    }
    
    @isTest
    static void getTemplatesTest() {
        List<ATR_Template__c> templates = new List<ATR_Template__c>();
        Integer numTemplates = 5;
        
        for (Integer i = 0; i < numTemplates; i++) {
            templates.add(new ATR_Template__c(Name = 'Template ' + i));
        }
        insert templates;
        
        List<ATR_Template__c> actual = ATR_ClientController.getTemplates();
        System.assertEquals(numTemplates, actual.size());
        for (Integer i = 0; i < numTemplates; i++) {
            System.assertEquals('Template ' + i, actual[i].Name);
        }
        
    }
    
    @isTest
    static void getRiskProfileTest() {
        List<Risk_Profile__c> riskProfiles = new List<Risk_Profile__c>();
        riskProfiles.add(new Risk_Profile__c( Name = 'Low',    LowScore__c = 0,  HighScore__c = 5,  Description__c = 'Low Risk'));
        riskProfiles.add(new Risk_Profile__c( Name = 'Medium', LowScore__c = 6,  HighScore__c = 10, Description__c = 'Medium Risk'));
        riskProfiles.add(new Risk_Profile__c( Name = 'High',   LowScore__c = 11, HighScore__c = 15, Description__c = 'High Risk'));
        insert riskProfiles;
        
        Risk_Profile__c actual = ATR_ClientController.getRiskProfile('3');
        System.assertEquals('Low', actual.Name);
        actual = ATR_ClientController.getRiskProfile('7');
        System.assertEquals('Medium', actual.Name);
        actual = ATR_ClientController.getRiskProfile('12');
        System.assertEquals('High', actual.Name);
        actual = ATR_ClientController.getRiskProfile('17');
        System.assertEquals(null, actual);
    }
    
    @isTest
    static void updateATRTest() {
        Risk_Profile__c profile = new Risk_Profile__c( Name = 'Low', LowScore__c = 0, HighScore__c = 5, Description__c = 'Low Risk');
        ATR_Taken__c actual = ATR_ClientController.updateATR(null, profile.Id);
        System.assertEquals(null, actual);
        
        // Set up test data
        Account client = new Account( Name = 'Andrew Foster' );
        insert client;
        
        ATR_Template__c template = new ATR_Template__c( Name = 'TestTemplate' );
        insert template;
        
        ATR_Taken__c atr = new ATR_Taken__c(ATR_Template__c = template.Id, Client__c = client.Id);
        insert atr;
        actual = ATR_ClientController.updateATR(atr, profile.Id);
        System.assert(actual != null);
        System.assertEquals(profile.Id, actual.Risk_Profile__c);
    }
}