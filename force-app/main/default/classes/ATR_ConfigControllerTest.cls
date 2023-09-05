@isTest
public class ATR_ConfigControllerTest { 
    @isTest
    static void addTemplateTest() {
        ATR_Template__c template = new ATR_Template__c( Name = 'TestTemplate' );
        ATR_ConfigController.addTemplate('TestTemplate');
        List<ATR_Template__c> templates = ATR_ConfigController.getTemplates();
        
        // Test that the method correctly inserted the template
        System.assertEquals(1, templates.size());
        System.assertEquals('TestTemplate', templates[0].Name);
    }
    
    @isTest
    static void getRiskProfileTest() {
        Risk_Profile__c profile = new Risk_Profile__c();
        profile.Name                  = 'Low';
        profile.HighScore__c = 10;
        profile.LowScore__c  = 5;
        insert profile;
        
        List<Risk_Profile__c> profiles = ATR_ConfigController.getProfiles();
        // Test that the method correctly inserted the risk profile
        System.assertEquals(1,     profiles.size());
        System.assertEquals('Low', profiles[0].Name);
        System.assertEquals(10,    profiles[0].HighScore__c);
        System.assertEquals(5,     profiles[0].LowScore__c);
    }
 
    @isTest
    static void updateQuestionTest() {
        ATR_Template__c template = new ATR_Template__c( Name = 'TestTemplate' );
        insert template;
        
        ATR_Question__c question = new ATR_Question__c( Question__c = 'Question 1', Order_Number__c = 0, ATR_Template__c = template.Id );
        List<ATR_Choice__c> choices  = new List<ATR_Choice__c>();
        List<ATR_Choice__c> todelete = new List<ATR_Choice__c>();
        choices.add(new ATR_Choice__c(Answer__c = 'Strongly Agree',    Score__c = 0, Order_Number__c = 0));
        choices.add(new ATR_Choice__c(Answer__c = 'Strongly Disagree', Score__c = 5, Order_Number__c = 2));
        List<ATR_Question__c> questions = ATR_ConfigController.updateQuestion(question, choices, todelete, template.Id);
         
        System.assertEquals(1, questions.size());
        System.assertEquals('Question 1', questions[0].Question__c);
        System.assertEquals(0, questions[0].Order_Number__c);
        
        List<ATR_Choice__c> actualChoices = ATR_ConfigController.getAnswers(questions[0].Id);
        System.assertEquals(2, actualChoices.size());
        System.assertEquals('Strongly Agree', actualChoices[0].Answer__c);
        System.assertEquals(0, actualChoices[0].Score__c);
        System.assertEquals('Strongly Disagree', actualChoices[1].Answer__c);
        System.assertEquals(5, actualChoices[1].Score__c);
        
        question.Question__c = 'Question 2';
        choices.add(new ATR_Choice__c(Answer__c = 'Agree', Score__c = 3, Order_Number__c = 1));
        questions = ATR_ConfigController.updateQuestion(question, choices, todelete, template.Id);
        
        System.assertEquals(1, questions.size());
        System.assertEquals('Question 2', questions[0].Question__c);
        System.assertEquals(0, questions[0].Order_Number__c);
        
        actualChoices = ATR_ConfigController.getAnswers(questions[0].Id);
        System.assertEquals(3, actualChoices.size());
        System.assertEquals('Strongly Agree', actualChoices[0].Answer__c);
        System.assertEquals(0, actualChoices[0].Score__c);
        System.assertEquals('Agree', actualChoices[1].Answer__c);
        System.assertEquals(3, actualChoices[1].Score__c);
        System.assertEquals('Strongly Disagree', actualChoices[2].Answer__c);
        System.assertEquals(5, actualChoices[2].Score__c);
    }
    
    @isTest
    static void updateQuestionOrderTest() {
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
        
        // Change the order of questions
        questions[0].Order_Number__c = 2;
        questions[1].Order_Number__c = 3;
        questions[2].Order_Number__c = 1;
        questions[3].Order_Number__c = 0;
        
        ATR_ConfigController.updateQuestionOrder(questions);
        
        List<ATR_Question__c> reorderedQuestions = [ SELECT Id, Question__c, Order_Number__c
                                                              FROM ATR_Question__c
                                                              ORDER BY Order_Number__c ];
        System.assertEquals(numQuestions, reorderedQuestions.size());
        System.assertEquals('Question 0', reorderedQuestions[2].Question__c);
        System.assertEquals('Question 1', reorderedQuestions[3].Question__c);
        System.assertEquals('Question 2', reorderedQuestions[1].Question__c);
        System.assertEquals('Question 3', reorderedQuestions[0].Question__c);
        
        // Remove the second question
        ATR_ConfigController.removeQuestion(reorderedQuestions[1].Id);
        reorderedQuestions = [ SELECT Id, Question__c, Order_Number__c
                               FROM ATR_Question__c
                               ORDER BY Order_Number__c ];
        System.assertEquals(numQuestions - 1, reorderedQuestions.size());
        System.assertEquals('Question 3',     reorderedQuestions[0].Question__c);
        System.assertEquals('Question 0',     reorderedQuestions[1].Question__c);
        System.assertEquals('Question 1',     reorderedQuestions[2].Question__c);
    }
}