public with sharing class ATR_QuestionnaireController {
    @AuraEnabled
    public static List<ATR_Question__c> getQuestions(String templateId) {
        List<ATR_Question__c> questions = new List<ATR_Question__c>();
        
        List<string> fields = new List<string> { 
            'Id', 
            'ATR_Template__c',
            'Question__c'
        };
        
        boolean isAccessible = ATR_FLSCheck.checkFLS(ATR_Question__c.sObjectType.getDescribe(), fields, 'Read');
        if (isAccessible) {
            questions = [ SELECT Id, ATR_Template__c, Question__c
                          FROM ATR_Question__c
                          WHERE ATR_Template__c = :templateId
                          ORDER BY Order_Number__c ];
        }
        return questions;
    }

    @auraEnabled
    public static List<ATR_Choice__c> getAnswerChoices(String questionId) {
        List<ATR_Choice__c> choices = new List<ATR_Choice__c>();
        
        List<string> fields = new List<string> { 
            'Id', 
            'Answer__c',
            'Score__c',
            'Order_Number__c'
        };
        
        boolean isAccessible = ATR_FLSCheck.checkFLS(ATR_Choice__c.sObjectType.getDescribe(), fields, 'Read');
        if (isAccessible) {
            choices = [ SELECT Id, Answer__c, Score__c
                        FROM ATR_Choice__c
                        WHERE ATR_Question__c = :questionId
                        ORDER BY Order_Number__c ];
        }
        return choices;
    }

    @auraEnabled
    public static ATR_Taken__c submitAnswers(String clientId, String templateId, List<ATR_Question_Response__c> responses) {
        ATR_Taken__c taken;
        
        // Create an ATR Taken record to store the questionnaire result
        Boolean isCreateable = ATR_FLSCheck.checkObjectSecurity(ATR_Taken__c.sObjectType.getDescribe(), 'Create');
        if (isCreateable) {
            
            taken = new ATR_Taken__c(Client__c = clientId, ATR_Template__c = templateId);
            insert taken;
            
            // Add responses for the questionnaire
            isCreateable = ATR_FLSCheck.checkObjectSecurity(ATR_Question_Response__c.sObjectType.getDescribe(), 'Create');
            if (isCreateable) {
                for (ATR_Question_Response__c response : responses) {
                    response.ATR_Taken__c = taken.Id;
                }
                insert responses;
                
                // Query the ATR Taken record to get scores
                List<string> fields = new List<string> { 
                    'Id', 
                    'ATR_Template__c',
                    'Client__c',
                    'ATR_Score__c'
                };
                
                boolean isAccessible = ATR_FLSCheck.checkFLS(ATR_Taken__c.sObjectType.getDescribe(), fields, 'Read');
                if (isAccessible) {
                    List<ATR_Taken__c> atrs = [ SELECT Id, ATR_Template__c, Client__c, ATR_Score__c 
                                                         FROM ATR_Taken__c 
                                                         WHERE Id = :taken.Id ];
                    if (atrs.size() > 0) {
                        taken = atrs[0];
                    }
                }
            }
        }
        return taken;
    }
}