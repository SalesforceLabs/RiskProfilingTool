@isTest
public class ATR_QuestionnaireControllerTest {
    
    @isTest
    static void questionnaireControllerTest() {
        Account client = new Account( Name = 'Andrew Foster' );
        insert client;
        
        ATR_Template__c template = new ATR_Template__c( Name = 'TestTemplate' );
        insert template;
        
        List<ATR_Question__c> questions = new List<ATR_Question__c>();
        Integer numQuestions = 4;
        for (Integer i = 0; i < numQuestions; i++) {
            questions.add(new ATR_Question__c(Question__c = 'Question ' + i,
                                                       Order_Number__c = i,
                                                       ATR_Template__c = template.Id));
        }
        
        insert questions;
        
        List<ATR_Question__c> actualQuestions = ATR_QuestionnaireController.getQuestions(template.Id);
        System.assertEquals(numQuestions, actualQuestions.size());
        for (Integer i = 0; i < numQuestions; i++) {
            System.assertEquals('Question ' + i, actualQuestions[i].Question__c);
        }
        
        List<ATR_Choice__c> choices = new List<ATR_Choice__c>();
        choices.add(new ATR_Choice__c(Answer__c = 'Strongly Agree',    Score__c = 0, ATR_Question__c = actualQuestions[0].Id));
        choices.add(new ATR_Choice__c(Answer__c = 'Strongly Disagree', Score__c = 5, ATR_Question__c = actualQuestions[0].Id));
        choices.add(new ATR_Choice__c(Answer__c = 'Agree',             Score__c = 1, ATR_Question__c = actualQuestions[1].Id));
        choices.add(new ATR_Choice__c(Answer__c = 'Disagree',          Score__c = 4, ATR_Question__c = actualQuestions[1].Id));
        choices.add(new ATR_Choice__c(Answer__c = 'Not sure',          Score__c = 3, ATR_Question__c = actualQuestions[1].Id));
        insert choices;
        
        List<ATR_Choice__c> actualChoices = ATR_QuestionnaireController.getAnswerChoices(actualQuestions[0].Id);
        
        System.assertEquals(2, actualChoices.size());
        actualChoices = ATR_QuestionnaireController.getAnswerChoices(actualQuestions[1].Id);
        System.assertEquals(3, actualChoices.size());
        
        List<ATR_Question_Response__c> responses = new List<ATR_Question_Response__c>();
        responses.add(new ATR_Question_Response__c(ATR_Question__c = actualQuestions[0].Id, Response__c = 'Strongly Agree', Response_Score__c = 0));
        responses.add(new ATR_Question_Response__c(ATR_Question__c = actualQuestions[1].Id, Response__c = 'Disagree', Response_Score__c = 4));
        
        ATR_Taken__c actualATR = ATR_QuestionnaireController.submitAnswers(client.Id, template.Id, responses);
        List<ATR_Question_Response__c> actualReponses = [ SELECT Id FROM ATR_Question_Response__c WHERE ATR_Taken__c = :actualATR.Id ];
        System.assertEquals(2, actualReponses.size());
        System.assertEquals(template.Id, actualATR.ATR_Template__c);
        System.assertEquals(client.Id, actualATR.Client__c);
        System.assertEquals(4, actualATR.ATR_Score__c);
       
    }
}