from rest_framework import serializers

from core.quiz2.models import Quiz2
from core.quiz2.models import Question
from core.quiz2.models import Answer

class AnswerSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Answer
        fields = [
            'text',
            'is_correct',
            'created',
            'updated',
        ]
        read_only_fields = ['question']

class QuestionSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)
    answerList = AnswerSerializer(many=True)

    class Meta:
        model = Question
        fields = [
            'text',
            'answerList',
            'created',
            'updated',
        ]


class Quiz2Serializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)
    questionList = QuestionSerializer(many=True)

    class Meta: 
        model = Quiz2
        fields = [
            'title',
            'author',
            'questionList',
            'created',
            'updated',
        ]
    def create(self, validated_data):
        questions_data = validated_data.pop('questionList')
        quiz2 = Quiz2.objects.create(**validated_data)
        for question_data in questions_data:
            answerList_data = question_data.pop('answerList')
            question = Question.objects.create(quiz2=quiz2, **question_data)
            for answer_data in answerList_data:
                Answer.objects.create(question=question, **answer_data)
        return quiz2
