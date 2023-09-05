public with sharing class ATR_ConfigController {
    @AuraEnabled
    public static List<ATR_Template__c> getTemplates() {
		List<ATR_Template__c> templates = new List<ATR_Template__c>();
        List<string> fields = new List<string> { 
            'Id', 
            'Name',
            'Maximum_Total_Score__c',
            'Minimum_Total_Score__c'
        };
        boolean isAccessible = ATR_FLSCheck.checkFLS(ATR_Template__c.sObjectType.getDescribe(), fields, 'Read');
        if (isAccessible) {
            templates = [ SELECT Id, Name, Maximum_Total_Score__c, Minimum_Total_Score__c 
                          FROM ATR_Template__c 
                          ORDER BY Name ];
        }
        return templates;
    }
    
    @AuraEnabled
    public static ATR_Template__c getTemplate(String templateId) {
		ATR_Template__c template = new ATR_Template__c();
        List<string> fields = new List<string> { 
            'Id', 
            'Name',
            'Maximum_Total_Score__c',
            'Minimum_Total_Score__c'
        };
        boolean isAccessible = ATR_FLSCheck.checkFLS(ATR_Template__c.sObjectType.getDescribe(), fields, 'Read');
        if (isAccessible) {
            template = [ SELECT Id, Name, Maximum_Total_Score__c, Minimum_Total_Score__c 
                         FROM ATR_Template__c
                         WHERE Id = :templateId];
        }
        return template;
    }
    
    @AuraEnabled
    public static ATR_Template__c addTemplate(String templateName) {
        ATR_Template__c template;
        Boolean isCreateable = ATR_FLSCheck.checkObjectSecurity(ATR_Template__c.sObjectType.getDescribe(), 'Create');
        if (isCreateable) {
            template = new ATR_Template__c( Name = templateName );
        	insert template;
            template = getTemplate(template.Id);
        }
        return template;
    }
        
    @AuraEnabled
    public static List<ATR_Question__c> getTemplateQuestions(String templateId) {
        List<ATR_Question__c> questions = new List<ATR_Question__c>();
        List<string> fields = new List<string> { 
            'Id',
            'Question__c',
            'Order_Number__c'
        };
        boolean isAccessible = ATR_FLSCheck.checkFLS(ATR_Question__c.sObjectType.getDescribe(), fields, 'Read');
        if (isAccessible) {
            questions = [ SELECT Id, Question__c, Order_Number__c
                          FROM ATR_Question__c 
                          WHERE ATR_Template__c =: templateId
                          ORDER BY Order_Number__c ];
        }
        return questions;
    }
    
    @AuraEnabled
    public static List<Risk_Profile__c> getProfiles() {
        List<Risk_Profile__c> profiles = new List<Risk_Profile__c>();
        List<string> fields = new List<string> { 
            'Id', 
            'Name',
            'Description__c',
            'HighScore__c',
            'LowScore__c'
        };
        boolean isAccessible = ATR_FLSCheck.checkFLS(Risk_Profile__c.sObjectType.getDescribe(), fields, 'Read');
        if (isAccessible) {
            profiles = [ SELECT Id, Name, Description__c, HighScore__c, LowScore__c
                         FROM Risk_Profile__c 
                         ORDER BY LowScore__c ];
        }
        return profiles;
    }

    @AuraEnabled
    public static List<ATR_Question__c> updateQuestion(ATR_Question__c question,
                                                                List<ATR_Choice__c> answers,
                                                                List<ATR_Choice__c> todelete,
                                                                String templateId) { 
                                                           
        boolean isUpsertable = ATR_FLSCheck.checkObjectSecurity(ATR_Question__c.sObjectType.getDescribe(), 'Update') &&
                               ATR_FLSCheck.checkObjectSecurity(ATR_Question__c.sObjectType.getDescribe(), 'Create') &&
                               ATR_FLSCheck.checkObjectSecurity(ATR_Choice__c.sObjectType.getDescribe(), 'Update') &&
                               ATR_FLSCheck.checkObjectSecurity(ATR_Choice__c.sObjectType.getDescribe(), 'Create') &&
                               ATR_FLSCheck.checkObjectSecurity(ATR_Choice__c.sObjectType.getDescribe(), 'Delete');
        
        if (isUpsertable) {
            upsert question;
            for (ATR_Choice__c choice : answers) {
                if (choice.Id == null) {
                    choice.ATR_Question__c = question.Id;
                }
            }
                                                               
            // Copying choices to another list
            // to avoid error (cannot upsert on List<sObject>)
            List<ATR_Choice__c> choiceList = new List<ATR_Choice__c>();
            choiceList.addAll(answers);
            upsert choiceList;
            delete todelete;
        }                                             
        return getTemplateQuestions(templateId);
    }
    
    @AuraEnabled
    public static void removeQuestion(String questionId) {
        Boolean isDeleteable = ATR_FLSCheck.checkObjectSecurity(ATR_Question__c.sObjectType.getDescribe(), 'Delete');
        if (isDeleteable) {
            List<ATR_Question__c> questions = [ SELECT Id FROM ATR_Question__c WHERE Id = :questionId ];
            delete questions;
        }
    }

    @AuraEnabled
    public static List<ATR_Question__c> updateQuestionOrder(List<ATR_Question__c> questions) {
        List<string> fields = new List<string> { 
            'Question__c',
            'Order_Number__c'
        };
        
        boolean isUpdatable = ATR_FLSCheck.checkFLS(ATR_Question__c.sObjectType.getDescribe(), fields, 'Update');
        if (isUpdatable) {
        	update questions;
        }
        return questions;
    }

    @AuraEnabled
    public static List<ATR_Choice__c> getAnswers(String questionId) {
        List<ATR_Choice__c> choices = new List<ATR_Choice__c>();
        
        List<string> fields = new List<string> { 
            'Id', 
            'Answer__c',
            'Score__c',
            'Order_Number__c'
        };
        
        boolean isAccessible = ATR_FLSCheck.checkFLS(ATR_Choice__c.sObjectType.getDescribe(), fields, 'Read');
        if (isAccessible) {
            choices = [ SELECT Id, Answer__c, Score__c, Order_Number__c 
                        FROM ATR_Choice__c 
                        WHERE ATR_Question__c =: questionId
                        ORDER BY Order_Number__c ];
        }
        return choices;
    }
}